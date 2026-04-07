import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BDmNGaIt.mjs';
import { manifest } from './manifest_LwKmz74p.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin/classes.astro.mjs');
const _page2 = () => import('./pages/admin/courses/new.astro.mjs');
const _page3 = () => import('./pages/admin/courses/_id_/builder.astro.mjs');
const _page4 = () => import('./pages/admin/courses/_id_/exams/_examid_.astro.mjs');
const _page5 = () => import('./pages/admin/dashboard.astro.mjs');
const _page6 = () => import('./pages/admin/users.astro.mjs');
const _page7 = () => import('./pages/admin.astro.mjs');
const _page8 = () => import('./pages/api/auth/login.astro.mjs');
const _page9 = () => import('./pages/api/auth/logout.astro.mjs');
const _page10 = () => import('./pages/api/auth/register.astro.mjs');
const _page11 = () => import('./pages/api/courses/create.astro.mjs');
const _page12 = () => import('./pages/courses/_courseid_/assignments/_id_.astro.mjs');
const _page13 = () => import('./pages/courses/_courseid_/exams/_id_.astro.mjs');
const _page14 = () => import('./pages/courses/_courseid_/learn/_materialid_.astro.mjs');
const _page15 = () => import('./pages/courses/_id_.astro.mjs');
const _page16 = () => import('./pages/dashboard.astro.mjs');
const _page17 = () => import('./pages/instructor/courses/_id_/builder.astro.mjs');
const _page18 = () => import('./pages/instructor/courses/_id_/exams/_examid_.astro.mjs');
const _page19 = () => import('./pages/instructor/courses/_id_/exams.astro.mjs');
const _page20 = () => import('./pages/instructor/courses/_id_/grading/_submissionid_.astro.mjs');
const _page21 = () => import('./pages/instructor/courses/_id_/grading.astro.mjs');
const _page22 = () => import('./pages/instructor/courses/_id_/students.astro.mjs');
const _page23 = () => import('./pages/instructor/courses/_id_.astro.mjs');
const _page24 = () => import('./pages/instructor/dashboard.astro.mjs');
const _page25 = () => import('./pages/login.astro.mjs');
const _page26 = () => import('./pages/profile.astro.mjs');
const _page27 = () => import('./pages/register.astro.mjs');
const _page28 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin/classes.astro", _page1],
    ["src/pages/admin/courses/new.astro", _page2],
    ["src/pages/admin/courses/[id]/builder.astro", _page3],
    ["src/pages/admin/courses/[id]/exams/[examId].astro", _page4],
    ["src/pages/admin/dashboard.astro", _page5],
    ["src/pages/admin/users.astro", _page6],
    ["src/pages/admin/index.astro", _page7],
    ["src/pages/api/auth/login.ts", _page8],
    ["src/pages/api/auth/logout.ts", _page9],
    ["src/pages/api/auth/register.ts", _page10],
    ["src/pages/api/courses/create.ts", _page11],
    ["src/pages/courses/[courseId]/assignments/[id].astro", _page12],
    ["src/pages/courses/[courseId]/exams/[id].astro", _page13],
    ["src/pages/courses/[courseId]/learn/[materialId].astro", _page14],
    ["src/pages/courses/[id].astro", _page15],
    ["src/pages/dashboard.astro", _page16],
    ["src/pages/instructor/courses/[id]/builder.astro", _page17],
    ["src/pages/instructor/courses/[id]/exams/[examId].astro", _page18],
    ["src/pages/instructor/courses/[id]/exams.astro", _page19],
    ["src/pages/instructor/courses/[id]/grading/[submissionId].astro", _page20],
    ["src/pages/instructor/courses/[id]/grading.astro", _page21],
    ["src/pages/instructor/courses/[id]/students.astro", _page22],
    ["src/pages/instructor/courses/[id]/index.astro", _page23],
    ["src/pages/instructor/dashboard.astro", _page24],
    ["src/pages/login.astro", _page25],
    ["src/pages/profile.astro", _page26],
    ["src/pages/register.astro", _page27],
    ["src/pages/index.astro", _page28]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "b5783e84-dcaa-4fbb-9505-47bd44c53ae1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
