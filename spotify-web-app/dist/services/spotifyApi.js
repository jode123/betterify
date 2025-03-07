"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTracks = exports.getPlaylistDetails = exports.getPlaylists = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://api.spotify.com/v1';
const getPlaylists = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${BASE_URL}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data.items;
});
exports.getPlaylists = getPlaylists;
const getPlaylistDetails = (playlistId, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${BASE_URL}/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
});
exports.getPlaylistDetails = getPlaylistDetails;
const searchTracks = (query, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${BASE_URL}/search`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: query,
            type: 'track',
        },
    });
    return response.data.tracks.items;
});
exports.searchTracks = searchTracks;
