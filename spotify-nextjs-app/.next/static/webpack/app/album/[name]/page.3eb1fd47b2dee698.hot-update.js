"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/album/[name]/page",{

/***/ "(app-pages-browser)/./src/utils/pipedApi.ts":
/*!*******************************!*\
  !*** ./src/utils/pipedApi.ts ***!
  \*******************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getAudioStream: function() { return /* binding */ getAudioStream; },\n/* harmony export */   searchMusic: function() { return /* binding */ searchMusic; }\n/* harmony export */ });\n/* harmony import */ var _config_piped__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/config/piped */ \"(app-pages-browser)/./src/config/piped.ts\");\n\nasync function searchMusic(query) {\n    try {\n        var _data_items;\n        const response = await fetch(\"\".concat(_config_piped__WEBPACK_IMPORTED_MODULE_0__.PIPED_API_INSTANCE, \"/api/v1/search?q=\").concat(encodeURIComponent(query + \" official audio\"), \"&filter=music\"), {\n            headers: {\n                \"Accept\": \"application/json\",\n                \"Content-Type\": \"application/json\"\n            }\n        });\n        if (!response.ok) {\n            console.error(\"API Response not OK:\", response.status);\n            throw new Error(\"Failed to fetch from Piped API\");\n        }\n        const data = await response.json();\n        console.log(\"Search results:\", data); // Debug log\n        if (!((_data_items = data.items) === null || _data_items === void 0 ? void 0 : _data_items.length)) {\n            console.log(\"No results found for query:\", query);\n            return null;\n        }\n        // Get the first result that matches our criteria\n        const bestMatch = data.items[0];\n        const videoId = bestMatch.url.split(\"watch?v=\")[1];\n        return {\n            title: bestMatch.title,\n            url: \"\".concat(_config_piped__WEBPACK_IMPORTED_MODULE_0__.PIPED_INSTANCE, \"/watch?v=\").concat(videoId),\n            id: videoId,\n            duration: bestMatch.duration,\n            uploaded: bestMatch.uploaded,\n            uploaderName: bestMatch.uploaderName,\n            uploaderUrl: bestMatch.uploaderUrl,\n            thumbnail: bestMatch.thumbnail\n        };\n    } catch (error) {\n        console.error(\"Piped search error:\", error);\n        return null;\n    }\n}\nasync function getAudioStream(videoId) {\n    try {\n        var _data_audioStreams_, _data_audioStreams;\n        const response = await fetch(\"\".concat(_config_piped__WEBPACK_IMPORTED_MODULE_0__.PIPED_API_INSTANCE, \"/streams/\").concat(videoId));\n        if (!response.ok) throw new Error(\"Failed to fetch stream data\");\n        const data = await response.json();\n        return ((_data_audioStreams = data.audioStreams) === null || _data_audioStreams === void 0 ? void 0 : (_data_audioStreams_ = _data_audioStreams[0]) === null || _data_audioStreams_ === void 0 ? void 0 : _data_audioStreams_.url) || null;\n    } catch (error) {\n        console.error(\"Error fetching audio stream:\", error);\n        return null;\n    }\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy91dGlscy9waXBlZEFwaS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBbUU7QUFhNUQsZUFBZUUsWUFBWUMsS0FBYTtJQUM3QyxJQUFJO1lBbUJHQztRQWxCTCxNQUFNQyxXQUFXLE1BQU1DLE1BQ3JCLEdBQXlDQyxPQUF0Q1AsNkRBQWtCQSxFQUFDLHFCQUFpRSxPQUE5Q08sbUJBQW1CSixRQUFRLG9CQUFtQixrQkFDdkY7WUFDRUssU0FBUztnQkFDUCxVQUFVO2dCQUNWLGdCQUFnQjtZQUNsQjtRQUNGO1FBR0YsSUFBSSxDQUFDSCxTQUFTSSxFQUFFLEVBQUU7WUFDaEJDLFFBQVFDLEtBQUssQ0FBQyx3QkFBd0JOLFNBQVNPLE1BQU07WUFDckQsTUFBTSxJQUFJQyxNQUFNO1FBQ2xCO1FBRUEsTUFBTVQsT0FBTyxNQUFNQyxTQUFTUyxJQUFJO1FBQ2hDSixRQUFRSyxHQUFHLENBQUMsbUJBQW1CWCxPQUFPLFlBQVk7UUFFbEQsSUFBSSxHQUFDQSxjQUFBQSxLQUFLWSxLQUFLLGNBQVZaLGtDQUFBQSxZQUFZYSxNQUFNLEdBQUU7WUFDdkJQLFFBQVFLLEdBQUcsQ0FBQywrQkFBK0JaO1lBQzNDLE9BQU87UUFDVDtRQUVBLGlEQUFpRDtRQUNqRCxNQUFNZSxZQUFZZCxLQUFLWSxLQUFLLENBQUMsRUFBRTtRQUMvQixNQUFNRyxVQUFVRCxVQUFVRSxHQUFHLENBQUNDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtRQUVsRCxPQUFPO1lBQ0xDLE9BQU9KLFVBQVVJLEtBQUs7WUFDdEJGLEtBQUssR0FBNkJELE9BQTFCbEIseURBQWNBLEVBQUMsYUFBbUIsT0FBUmtCO1lBQ2xDSSxJQUFJSjtZQUNKSyxVQUFVTixVQUFVTSxRQUFRO1lBQzVCQyxVQUFVUCxVQUFVTyxRQUFRO1lBQzVCQyxjQUFjUixVQUFVUSxZQUFZO1lBQ3BDQyxhQUFhVCxVQUFVUyxXQUFXO1lBQ2xDQyxXQUFXVixVQUFVVSxTQUFTO1FBQ2hDO0lBQ0YsRUFBRSxPQUFPakIsT0FBTztRQUNkRCxRQUFRQyxLQUFLLENBQUMsdUJBQXVCQTtRQUNyQyxPQUFPO0lBQ1Q7QUFDRjtBQUVPLGVBQWVrQixlQUFlVixPQUFlO0lBQ2xELElBQUk7WUFLS2YscUJBQUFBO1FBSlAsTUFBTUMsV0FBVyxNQUFNQyxNQUFNLEdBQWlDYSxPQUE5Qm5CLDZEQUFrQkEsRUFBQyxhQUFtQixPQUFSbUI7UUFDOUQsSUFBSSxDQUFDZCxTQUFTSSxFQUFFLEVBQUUsTUFBTSxJQUFJSSxNQUFNO1FBRWxDLE1BQU1ULE9BQU8sTUFBTUMsU0FBU1MsSUFBSTtRQUNoQyxPQUFPVixFQUFBQSxxQkFBQUEsS0FBSzBCLFlBQVksY0FBakIxQiwwQ0FBQUEsc0JBQUFBLGtCQUFtQixDQUFDLEVBQUUsY0FBdEJBLDBDQUFBQSxvQkFBd0JnQixHQUFHLEtBQUk7SUFDeEMsRUFBRSxPQUFPVCxPQUFPO1FBQ2RELFFBQVFDLEtBQUssQ0FBQyxnQ0FBZ0NBO1FBQzlDLE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy91dGlscy9waXBlZEFwaS50cz85M2Y1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBJUEVEX0FQSV9JTlNUQU5DRSwgUElQRURfSU5TVEFOQ0UgfSBmcm9tICdAL2NvbmZpZy9waXBlZCdcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlZFNlYXJjaFJlc3VsdCB7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICBpZDogc3RyaW5nOyAvLyBBZGQgdmlkZW8gSURcbiAgZHVyYXRpb246IG51bWJlcjtcbiAgdXBsb2FkZWQ6IHN0cmluZztcbiAgdXBsb2FkZXJOYW1lOiBzdHJpbmc7XG4gIHVwbG9hZGVyVXJsOiBzdHJpbmc7XG4gIHRodW1ibmFpbDogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VhcmNoTXVzaWMocXVlcnk6IHN0cmluZyk6IFByb21pc2U8UGlwZWRTZWFyY2hSZXN1bHQgfCBudWxsPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgIGAke1BJUEVEX0FQSV9JTlNUQU5DRX0vYXBpL3YxL3NlYXJjaD9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5ICsgJyBvZmZpY2lhbCBhdWRpbycpfSZmaWx0ZXI9bXVzaWNgLFxuICAgICAgeyBcbiAgICAgICAgaGVhZGVyczogeyBcbiAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICApO1xuXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc29sZS5lcnJvcignQVBJIFJlc3BvbnNlIG5vdCBPSzonLCByZXNwb25zZS5zdGF0dXMpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggZnJvbSBQaXBlZCBBUEknKTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIGNvbnNvbGUubG9nKCdTZWFyY2ggcmVzdWx0czonLCBkYXRhKTsgLy8gRGVidWcgbG9nXG5cbiAgICBpZiAoIWRhdGEuaXRlbXM/Lmxlbmd0aCkge1xuICAgICAgY29uc29sZS5sb2coJ05vIHJlc3VsdHMgZm91bmQgZm9yIHF1ZXJ5OicsIHF1ZXJ5KTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEdldCB0aGUgZmlyc3QgcmVzdWx0IHRoYXQgbWF0Y2hlcyBvdXIgY3JpdGVyaWFcbiAgICBjb25zdCBiZXN0TWF0Y2ggPSBkYXRhLml0ZW1zWzBdO1xuICAgIGNvbnN0IHZpZGVvSWQgPSBiZXN0TWF0Y2gudXJsLnNwbGl0KCd3YXRjaD92PScpWzFdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiBiZXN0TWF0Y2gudGl0bGUsXG4gICAgICB1cmw6IGAke1BJUEVEX0lOU1RBTkNFfS93YXRjaD92PSR7dmlkZW9JZH1gLCAvLyBDb25zdHJ1Y3QgcHJvcGVyIFBpcGVkIFVSTFxuICAgICAgaWQ6IHZpZGVvSWQsXG4gICAgICBkdXJhdGlvbjogYmVzdE1hdGNoLmR1cmF0aW9uLFxuICAgICAgdXBsb2FkZWQ6IGJlc3RNYXRjaC51cGxvYWRlZCxcbiAgICAgIHVwbG9hZGVyTmFtZTogYmVzdE1hdGNoLnVwbG9hZGVyTmFtZSxcbiAgICAgIHVwbG9hZGVyVXJsOiBiZXN0TWF0Y2gudXBsb2FkZXJVcmwsXG4gICAgICB0aHVtYm5haWw6IGJlc3RNYXRjaC50aHVtYm5haWxcbiAgICB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1BpcGVkIHNlYXJjaCBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEF1ZGlvU3RyZWFtKHZpZGVvSWQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYCR7UElQRURfQVBJX0lOU1RBTkNFfS9zdHJlYW1zLyR7dmlkZW9JZH1gKVxuICAgIGlmICghcmVzcG9uc2Uub2spIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoIHN0cmVhbSBkYXRhJylcbiAgICBcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXG4gICAgcmV0dXJuIGRhdGEuYXVkaW9TdHJlYW1zPy5bMF0/LnVybCB8fCBudWxsXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgYXVkaW8gc3RyZWFtOicsIGVycm9yKVxuICAgIHJldHVybiBudWxsXG4gIH1cbn0iXSwibmFtZXMiOlsiUElQRURfQVBJX0lOU1RBTkNFIiwiUElQRURfSU5TVEFOQ0UiLCJzZWFyY2hNdXNpYyIsInF1ZXJ5IiwiZGF0YSIsInJlc3BvbnNlIiwiZmV0Y2giLCJlbmNvZGVVUklDb21wb25lbnQiLCJoZWFkZXJzIiwib2siLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiLCJFcnJvciIsImpzb24iLCJsb2ciLCJpdGVtcyIsImxlbmd0aCIsImJlc3RNYXRjaCIsInZpZGVvSWQiLCJ1cmwiLCJzcGxpdCIsInRpdGxlIiwiaWQiLCJkdXJhdGlvbiIsInVwbG9hZGVkIiwidXBsb2FkZXJOYW1lIiwidXBsb2FkZXJVcmwiLCJ0aHVtYm5haWwiLCJnZXRBdWRpb1N0cmVhbSIsImF1ZGlvU3RyZWFtcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/utils/pipedApi.ts\n"));

/***/ })

});