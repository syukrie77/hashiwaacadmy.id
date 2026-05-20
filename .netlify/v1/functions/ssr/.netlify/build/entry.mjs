import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_Dw-xON77.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

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
const _page11 = () => import('./pages/api/builder/upload.astro.mjs');
const _page12 = () => import('./pages/api/builder/_table_/_id_.astro.mjs');
const _page13 = () => import('./pages/api/builder/_table_.astro.mjs');
const _page14 = () => import('./pages/api/courses/create.astro.mjs');
const _page15 = () => import('./pages/api/courses/_id_/data.astro.mjs');
const _page16 = () => import('./pages/api/courses/_id_/enroll.astro.mjs');
const _page17 = () => import('./pages/api/courses/_id_.astro.mjs');
const _page18 = () => import('./pages/api/exam/questions/_questionid_.astro.mjs');
const _page19 = () => import('./pages/api/exam/_examid_/questions.astro.mjs');
const _page20 = () => import('./pages/api/exam/_examid_/submit.astro.mjs');
const _page21 = () => import('./pages/api/exam/_examid_.astro.mjs');
const _page22 = () => import('./pages/api/grading/_submissionid_.astro.mjs');
const _page23 = () => import('./pages/api/payments/create-invoice.astro.mjs');
const _page24 = () => import('./pages/api/payments/status.astro.mjs');
const _page25 = () => import('./pages/api/payments/xendit-webhook.astro.mjs');
const _page26 = () => import('./pages/api/progress/_materialid_.astro.mjs');
const _page27 = () => import('./pages/contact.astro.mjs');
const _page28 = () => import('./pages/courses/_courseid_/assignments/_id_.astro.mjs');
const _page29 = () => import('./pages/courses/_courseid_/exams/_id_.astro.mjs');
const _page30 = () => import('./pages/courses/_courseid_/learn/_materialid_.astro.mjs');
const _page31 = () => import('./pages/courses/_id_.astro.mjs');
const _page32 = () => import('./pages/dashboard.astro.mjs');
const _page33 = () => import('./pages/instructor/courses/_id_/builder.astro.mjs');
const _page34 = () => import('./pages/instructor/courses/_id_/exams/_examid_.astro.mjs');
const _page35 = () => import('./pages/instructor/courses/_id_/exams.astro.mjs');
const _page36 = () => import('./pages/instructor/courses/_id_/grading/_submissionid_.astro.mjs');
const _page37 = () => import('./pages/instructor/courses/_id_/grading.astro.mjs');
const _page38 = () => import('./pages/instructor/courses/_id_/students.astro.mjs');
const _page39 = () => import('./pages/instructor/courses/_id_.astro.mjs');
const _page40 = () => import('./pages/instructor/dashboard.astro.mjs');
const _page41 = () => import('./pages/login.astro.mjs');
const _page42 = () => import('./pages/payment/failed.astro.mjs');
const _page43 = () => import('./pages/payment/success.astro.mjs');
const _page44 = () => import('./pages/profile.astro.mjs');
const _page45 = () => import('./pages/register.astro.mjs');
const _page46 = () => import('./pages/index.astro.mjs');
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
    ["src/pages/api/builder/upload.ts", _page11],
    ["src/pages/api/builder/[table]/[id].ts", _page12],
    ["src/pages/api/builder/[table]/index.ts", _page13],
    ["src/pages/api/courses/create.ts", _page14],
    ["src/pages/api/courses/[id]/data.ts", _page15],
    ["src/pages/api/courses/[id]/enroll.ts", _page16],
    ["src/pages/api/courses/[id]/index.ts", _page17],
    ["src/pages/api/exam/questions/[questionId].ts", _page18],
    ["src/pages/api/exam/[examId]/questions.ts", _page19],
    ["src/pages/api/exam/[examId]/submit.ts", _page20],
    ["src/pages/api/exam/[examId]/index.ts", _page21],
    ["src/pages/api/grading/[submissionId].ts", _page22],
    ["src/pages/api/payments/create-invoice.ts", _page23],
    ["src/pages/api/payments/status.ts", _page24],
    ["src/pages/api/payments/xendit-webhook.ts", _page25],
    ["src/pages/api/progress/[materialId].ts", _page26],
    ["src/pages/contact.astro", _page27],
    ["src/pages/courses/[courseId]/assignments/[id].astro", _page28],
    ["src/pages/courses/[courseId]/exams/[id].astro", _page29],
    ["src/pages/courses/[courseId]/learn/[materialId].astro", _page30],
    ["src/pages/courses/[id].astro", _page31],
    ["src/pages/dashboard.astro", _page32],
    ["src/pages/instructor/courses/[id]/builder.astro", _page33],
    ["src/pages/instructor/courses/[id]/exams/[examId].astro", _page34],
    ["src/pages/instructor/courses/[id]/exams.astro", _page35],
    ["src/pages/instructor/courses/[id]/grading/[submissionId].astro", _page36],
    ["src/pages/instructor/courses/[id]/grading.astro", _page37],
    ["src/pages/instructor/courses/[id]/students.astro", _page38],
    ["src/pages/instructor/courses/[id]/index.astro", _page39],
    ["src/pages/instructor/dashboard.astro", _page40],
    ["src/pages/login.astro", _page41],
    ["src/pages/payment/failed.astro", _page42],
    ["src/pages/payment/success.astro", _page43],
    ["src/pages/profile.astro", _page44],
    ["src/pages/register.astro", _page45],
    ["src/pages/index.astro", _page46]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "d7de8817-cfff-4112-ad9d-c6ae756513f4"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
