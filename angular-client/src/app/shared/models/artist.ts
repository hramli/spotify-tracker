import { image } from './image';

export class artist
{
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number
    };
    genres: string[];
    href: string;
    id: string;
    images: image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}