import{s as l}from"./supabase.BC4iv9s-.js";const c=window.location.pathname.split("/"),k=c[c.length-3]||c[c.length-2],r=c[c.length-1];console.log("CourseID:",k,"ExamID:",r);let a=[];async function p(){const{data:t,error:e}=await l.from("exams").select("*").eq("id",r).single();if(e||!t){console.error(e),document.getElementById("exam-title").textContent="Exam Not Found";return}document.getElementById("exam-title").textContent=t.title,document.getElementById("exam-desc").textContent=`Duration: ${t.duration} mins | Passing Score: ${t.passing_score||60}`;const{data:n,error:s}=await l.from("questions").select(`
                *,
                question_options (*)
            `).eq("exam_id",r).order("order_no",{ascending:!0});s&&console.error(s),n?.forEach(o=>{o.question_options&&o.question_options.sort((i,u)=>(i.order_no||0)-(u.order_no||0))}),a=n||[],C(),document.getElementById("loading").style.display="none",document.getElementById("questions-list").classList.remove("hidden")}function C(){const t=document.getElementById("questions-list");if(t.innerHTML="",a.length===0){t.innerHTML='<div class="empty-state">No questions added yet.</div>';return}a.forEach((e,n)=>{const s=document.createElement("div");s.className="question-card";let o="";e.type==="multiple_choice"&&e.question_options?.length>0?(o='<ul class="options-preview">',e.question_options.forEach(i=>{o+=`<li class="${i.is_correct?"correct":""}">
                        ${i.is_correct?"✅":"⚪"} ${i.option_text}
                    </li>`}),o+="</ul>"):e.type==="essay"&&(o='<div class="essay-preview">📝 Essay Question (Manual Grading)</div>'),s.innerHTML=`
                <div class="q-header">
                    <div class="q-number">Q${n+1}</div>
                    <div class="q-content">
                        <div class="q-text">${e.question}</div>
                        <div class="q-meta">
                            <span class="badge">${e.type.replace("_"," ")}</span>
                            <span class="points">${e.points||1} pts</span>
                        </div>
                        ${o}
                    </div>
                    <div class="q-actions">
                        <button class="btn-sm btn-outline edit-q" data-id="${e.id}">Edit</button>
                        <button class="btn-sm danger delete-q" data-id="${e.id}">Delete</button>
                    </div>
                </div>
            `,t.appendChild(s)}),document.querySelectorAll(".delete-q").forEach(e=>{e.onclick=async()=>{if(confirm("Delete this question?")){const n=e.dataset.id;await l.from("questions").delete().eq("id",n),p()}}}),document.querySelectorAll(".edit-q").forEach(e=>{e.onclick=()=>{const n=e.dataset.id,s=a.find(o=>o.id===n);x(s)}})}const I=document.getElementById("question-modal"),_=document.getElementById("question-form"),y=document.getElementById("q-type"),h=document.getElementById("options-section"),v=document.getElementById("options-list");function x(t=null){_.reset(),v.innerHTML="",t?(document.getElementById("q-id").value=t.id,document.getElementById("q-type").value=t.type,document.getElementById("q-text").value=t.question,document.getElementById("q-points").value=t.points,t.type==="multiple_choice"&&t.question_options?.forEach(e=>d(e))):(document.getElementById("q-id").value="",y.value==="multiple_choice"&&(d(),d())),b(),I.classList.remove("hidden")}function B(){I.classList.add("hidden")}function b(){y.value==="multiple_choice"?(h.classList.remove("hidden"),v.children.length===0&&(d(),d())):h.classList.add("hidden")}y.onchange=b;function d(t=null){const e=document.createElement("div");e.className="option-row";const n=t?.is_correct?"checked":"",s=t?.option_text||"",o=t?.id||"";e.innerHTML=`
            <input type="hidden" class="opt-id" value="${o}">
            <input type="radio" name="correct_option" class="opt-radio" ${n}>
            <input type="text" class="opt-text form-control" placeholder="Option text" value="${s}" required>
            <button type="button" class="btn-icon danger remove-opt">×</button>
        `,e.querySelector(".remove-opt").onclick=()=>e.remove(),v.appendChild(e)}document.getElementById("add-option-btn").onclick=()=>d();document.getElementById("add-question-btn").onclick=()=>x();document.querySelectorAll(".closeModal").forEach(t=>t.onclick=B);_.onsubmit=async t=>{t.preventDefault();const e=document.getElementById("q-id").value,n=document.getElementById("q-type").value,s=document.getElementById("q-text").value,o=document.getElementById("q-points").value,i={exam_id:r,type:n,question:s,points:parseInt(o)};e&&(i.id=e);const{data:u,error:q}=await l.from("questions").upsert(i).select().single();if(q){alert("Error saving question: "+q.message);return}if(n==="multiple_choice"){const $=Array.from(document.querySelectorAll(".option-row")).map((m,w)=>{const g=m.querySelector(".opt-id").value,L=m.querySelector(".opt-text").value,S=m.querySelector(".opt-radio").checked,E={question_id:u.id,option_text:L,is_correct:S,order_no:w};return g&&(E.id=g),E}),{error:f}=await l.from("question_options").upsert($);f&&console.error("Error saving options:",f)}B(),p()};p();
