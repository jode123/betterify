"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./src/components/LoginButton.tsx":
/*!****************************************!*\
  !*** ./src/components/LoginButton.tsx ***!
  \****************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ LoginButton; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var _lib_spotify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/spotify */ \"(app-pages-browser)/./src/lib/spotify.ts\");\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! framer-motion */ \"(app-pages-browser)/./node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs\");\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/dist/api/image.js\");\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\n\n\nfunction LoginButton() {\n    const handleLogin = ()=>{\n        window.location.href = (0,_lib_spotify__WEBPACK_IMPORTED_MODULE_1__.getLoginUrl)();\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"center-container\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n            initial: {\n                opacity: 0,\n                scale: 0.95\n            },\n            animate: {\n                opacity: 1,\n                scale: 1\n            },\n            transition: {\n                duration: 0.6\n            },\n            className: \"bg-[var(--background-secondary)] rounded-lg p-3 shadow-2xl w-[280px]\",\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n                initial: {\n                    opacity: 0,\n                    y: 20\n                },\n                animate: {\n                    opacity: 1,\n                    y: 0\n                },\n                transition: {\n                    duration: 0.6\n                },\n                className: \"flex flex-col items-center gap-2 w-full text-center\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n                        initial: {\n                            scale: 0.8,\n                            opacity: 0\n                        },\n                        animate: {\n                            scale: 1,\n                            opacity: 1\n                        },\n                        transition: {\n                            delay: 0.2,\n                            duration: 0.5\n                        },\n                        className: \"logo-container\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                            src: \"/images/logo.png\",\n                            alt: \"Logo\",\n                            width: 132,\n                            height: 132,\n                            priority: true,\n                            className: \"logo-image\"\n                        }, void 0, false, {\n                            fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                            lineNumber: 32,\n                            columnNumber: 13\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                        lineNumber: 26,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.h1, {\n                        initial: {\n                            opacity: 0\n                        },\n                        animate: {\n                            opacity: 1\n                        },\n                        transition: {\n                            delay: 0.4\n                        },\n                        className: \"text-[var(--text-primary)] text-2xl font-bold\",\n                        children: \"Betterify\"\n                    }, void 0, false, {\n                        fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                        lineNumber: 42,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.p, {\n                        initial: {\n                            opacity: 0\n                        },\n                        animate: {\n                            opacity: 1\n                        },\n                        transition: {\n                            delay: 0.6\n                        },\n                        className: \"text-[var(--text-secondary)] text-sm\",\n                        children: \"Your music. Your way.\"\n                    }, void 0, false, {\n                        fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                        lineNumber: 51,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.button, {\n                        initial: {\n                            opacity: 0,\n                            y: 20\n                        },\n                        animate: {\n                            opacity: 1,\n                            y: 0\n                        },\n                        transition: {\n                            delay: 0.8\n                        },\n                        onClick: handleLogin,\n                        className: \"w-40 apple-button bg-[var(--system-pink)] hover:bg-[var(--system-red)]  py-2 text-sm text-[var(--text-primary)] transition-all duration-200 rounded-md shadow-lg hover:shadow-xl\",\n                        children: \"Connect with Spotify\"\n                    }, void 0, false, {\n                        fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                        lineNumber: 60,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n                lineNumber: 20,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n            lineNumber: 14,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/workspaces/betterify/spotify-nextjs-app/src/components/LoginButton.tsx\",\n        lineNumber: 13,\n        columnNumber: 5\n    }, this);\n}\n_c = LoginButton;\nvar _c;\n$RefreshReg$(_c, \"LoginButton\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL0xvZ2luQnV0dG9uLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFMkM7QUFDTDtBQUNSO0FBRWYsU0FBU0c7SUFDdEIsTUFBTUMsY0FBYztRQUNsQkMsT0FBT0MsUUFBUSxDQUFDQyxJQUFJLEdBQUdQLHlEQUFXQTtJQUNwQztJQUVBLHFCQUNFLDhEQUFDUTtRQUFJQyxXQUFVO2tCQUNiLDRFQUFDUixpREFBTUEsQ0FBQ08sR0FBRztZQUNURSxTQUFTO2dCQUFFQyxTQUFTO2dCQUFHQyxPQUFPO1lBQUs7WUFDbkNDLFNBQVM7Z0JBQUVGLFNBQVM7Z0JBQUdDLE9BQU87WUFBRTtZQUNoQ0UsWUFBWTtnQkFBRUMsVUFBVTtZQUFJO1lBQzVCTixXQUFVO3NCQUVWLDRFQUFDUixpREFBTUEsQ0FBQ08sR0FBRztnQkFDVEUsU0FBUztvQkFBRUMsU0FBUztvQkFBR0ssR0FBRztnQkFBRztnQkFDN0JILFNBQVM7b0JBQUVGLFNBQVM7b0JBQUdLLEdBQUc7Z0JBQUU7Z0JBQzVCRixZQUFZO29CQUFFQyxVQUFVO2dCQUFJO2dCQUM1Qk4sV0FBVTs7a0NBRVYsOERBQUNSLGlEQUFNQSxDQUFDTyxHQUFHO3dCQUNURSxTQUFTOzRCQUFFRSxPQUFPOzRCQUFLRCxTQUFTO3dCQUFFO3dCQUNsQ0UsU0FBUzs0QkFBRUQsT0FBTzs0QkFBR0QsU0FBUzt3QkFBRTt3QkFDaENHLFlBQVk7NEJBQUVHLE9BQU87NEJBQUtGLFVBQVU7d0JBQUk7d0JBQ3hDTixXQUFVO2tDQUVWLDRFQUFDUCxrREFBS0E7NEJBQ0pnQixLQUFJOzRCQUNKQyxLQUFJOzRCQUNKQyxPQUFPOzRCQUNQQyxRQUFROzRCQUNSQyxRQUFROzRCQUNSYixXQUFVOzs7Ozs7Ozs7OztrQ0FJZCw4REFBQ1IsaURBQU1BLENBQUNzQixFQUFFO3dCQUNSYixTQUFTOzRCQUFFQyxTQUFTO3dCQUFFO3dCQUN0QkUsU0FBUzs0QkFBRUYsU0FBUzt3QkFBRTt3QkFDdEJHLFlBQVk7NEJBQUVHLE9BQU87d0JBQUk7d0JBQ3pCUixXQUFVO2tDQUNYOzs7Ozs7a0NBSUQsOERBQUNSLGlEQUFNQSxDQUFDdUIsQ0FBQzt3QkFDUGQsU0FBUzs0QkFBRUMsU0FBUzt3QkFBRTt3QkFDdEJFLFNBQVM7NEJBQUVGLFNBQVM7d0JBQUU7d0JBQ3RCRyxZQUFZOzRCQUFFRyxPQUFPO3dCQUFJO3dCQUN6QlIsV0FBVTtrQ0FDWDs7Ozs7O2tDQUlELDhEQUFDUixpREFBTUEsQ0FBQ3dCLE1BQU07d0JBQ1pmLFNBQVM7NEJBQUVDLFNBQVM7NEJBQUdLLEdBQUc7d0JBQUc7d0JBQzdCSCxTQUFTOzRCQUFFRixTQUFTOzRCQUFHSyxHQUFHO3dCQUFFO3dCQUM1QkYsWUFBWTs0QkFBRUcsT0FBTzt3QkFBSTt3QkFDekJTLFNBQVN0Qjt3QkFDVEssV0FBVTtrQ0FJWDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9YO0tBckV3Qk4iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvTG9naW5CdXR0b24udHN4PzRlNTciXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IGdldExvZ2luVXJsIH0gZnJvbSAnQC9saWIvc3BvdGlmeSdcbmltcG9ydCB7IG1vdGlvbiB9IGZyb20gJ2ZyYW1lci1tb3Rpb24nXG5pbXBvcnQgSW1hZ2UgZnJvbSAnbmV4dC9pbWFnZSdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9naW5CdXR0b24oKSB7XG4gIGNvbnN0IGhhbmRsZUxvZ2luID0gKCkgPT4ge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gZ2V0TG9naW5VcmwoKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlci1jb250YWluZXJcIj5cbiAgICAgIDxtb3Rpb24uZGl2IFxuICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1IH19XG4gICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEgfX1cbiAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC42IH19XG4gICAgICAgIGNsYXNzTmFtZT1cImJnLVt2YXIoLS1iYWNrZ3JvdW5kLXNlY29uZGFyeSldIHJvdW5kZWQtbGcgcC0zIHNoYWRvdy0yeGwgdy1bMjgwcHhdXCJcbiAgICAgID5cbiAgICAgICAgPG1vdGlvbi5kaXYgXG4gICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB5OiAyMCB9fVxuICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeTogMCB9fVxuICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDAuNiB9fVxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0yIHctZnVsbCB0ZXh0LWNlbnRlclwiXG4gICAgICAgID5cbiAgICAgICAgICA8bW90aW9uLmRpdlxuICAgICAgICAgICAgaW5pdGlhbD17eyBzY2FsZTogMC44LCBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IHNjYWxlOiAxLCBvcGFjaXR5OiAxIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGRlbGF5OiAwLjIsIGR1cmF0aW9uOiAwLjUgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImxvZ28tY29udGFpbmVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8SW1hZ2UgXG4gICAgICAgICAgICAgIHNyYz1cIi9pbWFnZXMvbG9nby5wbmdcIlxuICAgICAgICAgICAgICBhbHQ9XCJMb2dvXCJcbiAgICAgICAgICAgICAgd2lkdGg9ezEzMn1cbiAgICAgICAgICAgICAgaGVpZ2h0PXsxMzJ9XG4gICAgICAgICAgICAgIHByaW9yaXR5XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImxvZ28taW1hZ2VcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L21vdGlvbi5kaXY+XG4gICAgICAgICAgXG4gICAgICAgICAgPG1vdGlvbi5oMVxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwIH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZGVsYXk6IDAuNCB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1bdmFyKC0tdGV4dC1wcmltYXJ5KV0gdGV4dC0yeGwgZm9udC1ib2xkXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBCZXR0ZXJpZnlcbiAgICAgICAgICA8L21vdGlvbi5oMT5cbiAgICAgICAgICBcbiAgICAgICAgICA8bW90aW9uLnBcbiAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCB9fVxuICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxIH19XG4gICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGRlbGF5OiAwLjYgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtW3ZhcigtLXRleHQtc2Vjb25kYXJ5KV0gdGV4dC1zbVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgWW91ciBtdXNpYy4gWW91ciB3YXkuXG4gICAgICAgICAgPC9tb3Rpb24ucD5cblxuICAgICAgICAgIDxtb3Rpb24uYnV0dG9uXG4gICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHk6IDIwIH19XG4gICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHk6IDAgfX1cbiAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZGVsYXk6IDAuOCB9fVxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlTG9naW59XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTQwIGFwcGxlLWJ1dHRvbiBiZy1bdmFyKC0tc3lzdGVtLXBpbmspXSBob3ZlcjpiZy1bdmFyKC0tc3lzdGVtLXJlZCldIFxuICAgICAgICAgICAgICBweS0yIHRleHQtc20gdGV4dC1bdmFyKC0tdGV4dC1wcmltYXJ5KV1cbiAgICAgICAgICAgICAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMjAwIHJvdW5kZWQtbWRcbiAgICAgICAgICAgICAgc2hhZG93LWxnIGhvdmVyOnNoYWRvdy14bFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgQ29ubmVjdCB3aXRoIFNwb3RpZnlcbiAgICAgICAgICA8L21vdGlvbi5idXR0b24+XG4gICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgIDwvbW90aW9uLmRpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5cbiJdLCJuYW1lcyI6WyJnZXRMb2dpblVybCIsIm1vdGlvbiIsIkltYWdlIiwiTG9naW5CdXR0b24iLCJoYW5kbGVMb2dpbiIsIndpbmRvdyIsImxvY2F0aW9uIiwiaHJlZiIsImRpdiIsImNsYXNzTmFtZSIsImluaXRpYWwiLCJvcGFjaXR5Iiwic2NhbGUiLCJhbmltYXRlIiwidHJhbnNpdGlvbiIsImR1cmF0aW9uIiwieSIsImRlbGF5Iiwic3JjIiwiYWx0Iiwid2lkdGgiLCJoZWlnaHQiLCJwcmlvcml0eSIsImgxIiwicCIsImJ1dHRvbiIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/LoginButton.tsx\n"));

/***/ })

});