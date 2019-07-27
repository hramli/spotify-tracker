const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

const app_url = "http://localhost:3000";
const redirect_uri = "http://localhost:3000/api";
const client_id = "8df7a334ca254aa9b4700e7ba18cfefb";
const client_secret = "94b073b328ff4770aecf615e7bc54686";
const scope = "user-read-recently-played%20user-top-read";


//redirect to authorization page, then redirect back to react page
app.get('/' , (req, res) => {
    res.redirect(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`);
});

app.get('/api', (req,res) => {
    var code = req.query.code;
    var base64Encoding = Buffer.from(client_id+":"+client_secret).toString('base64');
    var formData = {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri
    };
    request.post(
        'https://accounts.spotify.com/api/token',
        {
            form: formData,
            headers: {
                "Authorization": "Basic "+base64Encoding,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            json: true
        },
        (err, httpResponse, body) => {
            //body is already JSON
            var data = body;
            var token_type = data.token_type;
            var access_token = data.access_token;
            console.log(`token_type ${token_type}`);
            console.log(`access_token ${access_token}`);
            res.redirect(`http://localhost:4200?token_type=${token_type}&access_token=${access_token}`);
            // var recent = getRecentlyPlayed(token_type, access_token);
            // recent.then((body) => {
            //     res.send(body.items[0].track.artists[0].name);
            //     let set = new Set();
            //     for(let i = 0; i < body.items.length; i++)
            //         set.add(body.items[i].played_at);
                
                
            //     // res.redirect(app_url+"/home");
            // }).catch(err => {
            //     res.send(err);
            // })
        }
    );
});

app.get('/api/recent', (req, res) => {
    let token_type = req.query.token_type;
    let access_token = req.query.access_token;
});

app.get('/api/artist', (req, res) => {
    console.log("Called /api/artist");
    let token_type = req.query.token_type;
    let access_token = req.query.access_token;
    getTopArtists(token_type, access_token).then((body) => {
        res.send(body);
    }).catch(err => {
        console.log("error");
        res.status(err.status);
        res.send("Internal Server Error");
    });
});

app.get('/api/track', (req, res) => {
    let token_type = req.query.token_type;
    let access_token = req.query.access_token;
    getTopTracks(token_type, access_token).then((body) => {
        res.send(body);
    }).catch(err => {
        res.status(err.status);
        res.send("Internal Server Error");
    })
});

//returns JSON
app.get('/api/genre', (req, res) => {
    let token_type = req.query.token_type;
    let access_token = req.query.access_token;
    let time_range = req.query.time_range;
    if(time_range == null)
        time_range = "medium_term"

    console.log("Called /api/genre");

    getTopArtists(token_type, access_token, 50, time_range).then((body) => {
        var genre = {};
        for(let i = 0; i < body.items.length; i++)
        {
            var genres = body.items[i].genres;
            for(let j = 0; j < genres.length; j++)
            {
                if(genre.hasOwnProperty(genres[j]))
                {
                    genre[genres[j]]++;
                }
                else
                {
                    genre[genres[j]] = 1;
                }
            }
        }
        genre = inverseSortObjectByValue(genre);
        res.send(genre);
    }).catch(err => {
        console.log(err);
    });
});

function getRecentlyPlayed(token_type,access_token, limit = 20){
    return new Promise( (resolve, reject) => {
        request.get(
            `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
            {
                headers: {
                    "Authorization": `${token_type} ${access_token}`
                }
            },
            (err,httpResponse, body) => {
                if(!body)
                    reject({message: "No body"});
                resolve(JSON.parse(body));
            }
        );
    })
}

function getGenres(token_type, access_token, artist_id){
    return new Promise((resolve, reject) => {
        request.get(
            `https://api.spotify.com/v1/artists/${artist_id}`,
            {
                headers:{
                    "Authorization": `${token_type} ${access_token}`
                }
            },
            (err,httpResponse,body) => {
                if(!body)
                    reject({message: "No body"});
                resolve(JSON.parse(body));
            }
        )
    });
}

function getTopArtists(token_type, access_token, limit=20, time_range="long_term", offset=0){
    return new Promise((resolve, reject) => {
        request.get(
            `https://api.spotify.com/v1/me/top/artists?limit=${limit}&offset=${offset}&time_range=${time_range}`,
            {
                headers:{
                    "Authorization": `${token_type} ${access_token}`
                }
            },
            (err,httpResponse,body) => {
                if(!body)
                    reject({message: "No body"});
                resolve(JSON.parse(body));
            }
        )
    })
}

function getTopTracks(token_type, access_token, limit=20, offset=0, time_range="long_term"){
    return new Promise((resolve, reject) => {
        request.get(
            `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${time_range}`,
            {
                headers:{
                    "Authorization": `${token_type} ${access_token}`
                }
            },
            (err,httpResponse,body) => {
                if(!body)
                    reject({message: "No body"});
                resolve(JSON.parse(body));
            }
        )
    })
}


function inverseSortObjectByValue(object){
    var sortable = [];
    for(var key in object){
        sortable.push([key, object[key]]);
    }
    sortable.sort(function(a,b){
        return b[1]-a[1];
    });
    return sortable;
}

app.listen(port, () => console.log('Listening on port' + port));