import{s as c}from"./supabase.BC4iv9s-.js";const w=window.location.pathname.split("/"),r=w[w.length-2],$=document.getElementById("user-data"),S=$?$.dataset.user:null;(!S||JSON.parse(S).role!=="admin")&&(window.location.href="/login");async function P(){const{data:t}=await c.from("classes").select("*").eq("id",r).single(),{data:o}=await c.from("modules").select("*").eq("class_id",r).order("order_no"),{data:e}=await c.from("materials").select("*, modules!inner(class_id)").eq("modules.class_id",r).order("order_no"),{data:d}=await c.from("assignments").select("*").eq("class_id",r),{data:n}=await c.from("exams").select("*").eq("class_id",r);return{course:t,modules:o,materials:e,assignments:d,exams:n}}function O(t){t.course&&(document.getElementById("course-title").textContent=t.course.title,document.getElementById("course-desc").textContent=t.course.description,R(t),z(t),U(t))}function R(t){const o=document.getElementById("modules-list");if(o){if(o.innerHTML="",!t.modules||t.modules.length===0){o.innerHTML='<div class="empty-state">No modules yet.</div>';return}t.modules.forEach(e=>{const d=document.createElement("div");d.className="module-card",d.innerHTML=`
                <div class="module-header">
                    <div>
                        <h3>${e.title}</h3>
                        ${e.price>0?`<div class="badge-price">Rp ${e.price.toLocaleString("id-ID")}</div>`:""}
                    </div>
                    <div class="mod-actions">
                        <button class="btn-sm btn-outline add-mat" data-id="${e.id}">+ Material</button>
                        <button class="btn-sm btn-outline edit-mod" data-id="${e.id}">Edit</button>
                        <button class="btn-sm btn-outline delete-mod" data-id="${e.id}">Delete</button>
                    </div>
                </div>
                <ul class="materials-list" id="m-list-${e.id}"></ul>
            `,o.appendChild(d);const n=d.querySelector(`#m-list-${e.id}`);(t.materials||[]).filter(a=>a.module_id===e.id).forEach(a=>{const m=document.createElement("li");m.innerHTML=`
                    <div class="mat-info">
                        <span class="type-icon">${a.type==="video"?"📽️":a.type==="pdf"?"📄":"📝"}</span>
                        <span class="mat-name">${a.title}</span>
                        <span class="mat-order">Order: ${a.order_no}</span>
                    </div>
                    <div>
                        <button class="edit-mat" data-id="${a.id}">✏️</button>
                        <button class="delete-mat" data-id="${a.id}">🗑️</button>
                    </div>
                `,n&&n.appendChild(m)})}),document.querySelectorAll(".delete-mod").forEach(e=>e.onclick=()=>E("modules",e.dataset.id,"Delete module and materials?")),document.querySelectorAll(".delete-mat").forEach(e=>e.onclick=()=>E("materials",e.dataset.id,"Delete material?")),document.querySelectorAll(".add-mat").forEach(e=>{e.onclick=()=>{document.getElementById("material-form").reset(),document.getElementById("mat-id").value="",document.getElementById("upload-status").textContent="",y();const n=document.getElementById("mat-mod-id");n&&(n.value=e.dataset.id),document.getElementById("material-modal")?.classList.remove("hidden")}}),document.querySelectorAll(".edit-mod").forEach(e=>{e.onclick=()=>{const d=e.dataset.id,n=t.modules.find(i=>i.id===d);n&&(document.getElementById("module-form").reset(),document.getElementById("module-id").value=n.id,document.getElementById("m-title").value=n.title,document.getElementById("m-order").value=n.order_no||0,g("module-modal"))}}),document.querySelectorAll(".edit-mat").forEach(e=>{e.onclick=()=>{const d=e.dataset.id,n=(t.materials||[]).find(i=>i.id===d);if(n){document.getElementById("material-form").reset(),document.getElementById("mat-id").value=n.id,document.getElementById("mat-mod-id").value=n.module_id,document.getElementById("mat-title").value=n.title,document.getElementById("mat-type").value=n.type,document.getElementById("mat-order").value=n.order_no||0,document.getElementById("mat-duration").value=n.duration||0;const a=document.getElementById("mat-content")?.parentElement,m=document.getElementById("file-upload-group");if(document.getElementById("mat-type").dispatchEvent(new Event("change")),n.type==="text")document.getElementById("mat-content").value=n.content,m?.classList.add("hidden"),a?.classList.remove("hidden"),setTimeout(L,100);else{m?.classList.remove("hidden"),a?.classList.add("hidden");const v=document.getElementById("upload-status");v&&(v.textContent="Current file: "+(n.content?"Uploaded":"None")),document.getElementById("mat-content").value=n.content||""}g("material-modal")}}})}}function z(t){const o=document.getElementById("assignments-list");o&&(o.innerHTML=(t.assignments||[]).map(e=>`
            <div class="item-row">
                <div class="item-info">
                    <h4>${e.title}</h4>
                    <span class="muted">Deadline: ${e.deadline?new Date(e.deadline).toLocaleString():"No deadline"}</span>
                </div>
                <button class="btn-sm danger delete-ass" data-id="${e.id}">Delete</button>
            </div>
        `).join("")||'<div class="empty-state">No assignments yet.</div>',document.querySelectorAll(".delete-ass").forEach(e=>e.onclick=()=>E("assignments",e.dataset.id,"Delete assignment?")))}function U(t){const o=document.getElementById("exams-list");o&&(o.innerHTML=(t.exams||[]).map(e=>`
            <div class="item-row exam-row">
                <div class="item-info">
                    <h4>${e.title}</h4>
                    <span class="muted">Duration: ${e.duration} mins · Passing: ${e.passing_score||60}%</span>
                </div>
                <div class="exam-actions-row">
                    <span class="exam-status-badge ${e.is_published?"published":"draft"}">${e.is_published?"✅ Published":"🔒 Draft"}</span>
                    <button class="btn-sm btn-outline toggle-publish-ex" data-id="${e.id}" data-published="${!!e.is_published}">${e.is_published?"Unpublish":"Publish"}</button>
                    <a href="/instructor/courses/${r}/exams/${e.id}" class="btn-sm btn-outline">📝 Questions</a>
                    <button class="btn-sm danger delete-ex" data-id="${e.id}">Delete</button>
                </div>
            </div>
        `).join("")||'<div class="empty-state">No exams yet.</div>',document.querySelectorAll(".toggle-publish-ex").forEach(e=>{e.onclick=async()=>{const d=e.dataset.id,n=e.dataset.published==="true",{error:i}=await c.from("exams").update({is_published:!n}).eq("id",d);i||p()}}),document.querySelectorAll(".delete-ex").forEach(e=>e.onclick=()=>E("exams",e.dataset.id,"Delete exam?")))}async function p(){const t=await P();O(t),document.getElementById("loading").style.display="none",document.getElementById("builder-content").classList.remove("hidden")}document.querySelectorAll(".tab-btn").forEach(t=>{t.onclick=()=>{document.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active")),t.classList.add("active"),document.getElementById(`tab-${t.dataset.tab}`)?.classList.add("active")}});const g=t=>document.getElementById(t)?.classList.remove("hidden"),I=()=>{document.querySelectorAll(".modal").forEach(t=>t.classList.add("hidden")),typeof y=="function"&&y()};document.getElementById("add-module-btn").onclick=()=>{document.getElementById("module-form").reset(),document.getElementById("module-id").value="",g("module-modal")};document.getElementById("add-assignment-btn").onclick=()=>g("assignment-modal");document.getElementById("add-exam-btn").onclick=()=>g("exam-modal");document.querySelectorAll(".closeModal").forEach(t=>t.onclick=I);const B=async(t,o,e,d)=>{const n=document.getElementById(t);n.onsubmit=async i=>{i.preventDefault();const a=e();a.id||delete a.id,tinymce.get("mat-content")&&(document.getElementById("mat-content").value=tinymce.get("mat-content").getContent());const{error:m}=await c.from(o).upsert(a);m||(I(),n.reset(),p())}};B("module-form","modules",()=>({class_id:r,id:document.getElementById("module-id").value,title:document.getElementById("m-title").value,price:parseFloat(document.getElementById("m-price").value),order_no:document.getElementById("m-order").value}));const x=document.getElementById("material-form"),h=document.getElementById("mat-type"),k=document.getElementById("file-upload-group"),M=document.getElementById("mat-content")?.parentElement,L=()=>{tinymce.get("mat-content")||tinymce.init({selector:"#mat-content",plugins:"advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",toolbar:"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",height:300,setup:function(t){t.on("change",function(){t.save()})}})},y=()=>{tinymce.get("mat-content")&&tinymce.get("mat-content").remove()};h.onchange=()=>{const t=h.value;if(t==="text")k?.classList.add("hidden"),M?.classList.remove("hidden"),L();else{k?.classList.remove("hidden"),M?.classList.add("hidden");const o=document.getElementById("mat-file");t==="video"?o.accept="video/*":t==="pdf"&&(o.accept=".pdf"),y()}};x.onsubmit=async t=>{t.preventDefault();const o=h.value,e=document.getElementById("mat-file"),d=document.getElementById("upload-status");let n="";o==="text"&&tinymce.get("mat-content")?n=tinymce.get("mat-content").getContent():n=document.getElementById("mat-content").value;try{if(o!=="text"&&e.files?.length){const s=e.files[0],u=s.name.toLowerCase().split(".").pop()||"unknown",_=["video/mp4","video/webm","video/ogg","video/quicktime"],D=["mp4","webm","ogg","mov","avi","mkv"],F=["application/pdf"],q=["pdf"];if(o==="video"){if(!_.includes(s.type)&&!D.includes(u))throw new Error(`❌ Format video tidak valid.

Format yang didukung: MP4, WebM, OGG, MOV
File Anda: ${s.type||u}`)}else if(o==="pdf"&&!F.includes(s.type)&&!q.includes(u))throw new Error(`❌ Format file bukan PDF.

File Anda: ${s.type||u}`);const A=o==="video"?500*1024*1024:50*1024*1024,C=o==="video"?500:50;if(s.size>A)throw new Error(`❌ Ukuran file terlalu besar!

Maksimal: ${C}MB
File Anda: ${(s.size/1024/1024).toFixed(2)}MB`);d&&(d.textContent=`Mengupload ${o==="video"?"video":"PDF"} (${(s.size/1024/1024).toFixed(1)}MB)...`);const T=`${Date.now()}_${Math.random().toString(36).substring(7)}.${u}`,b=`${r}/${T}`,{data:G,error:f}=await c.storage.from("materials").upload(b,s,{cacheControl:"3600",upsert:!1});if(f){console.error("=== UPLOAD ERROR DEBUG ==="),console.error("Error object:",f),console.error("Error message:",f.message),console.error("Error status:",f.status),console.error("Full error:",JSON.stringify(f)),console.error("========================");const l=f.message||"Unknown upload error";throw l.includes("Bucket")&&l.includes("not found")?new Error(`❌ Storage bucket 'materials' NOT FOUND

FIX:
1. Supabase Dashboard → Storage
2. + New Bucket → Name: materials
3. Check 'Make it public'
4. Create → Refresh page`):l.includes("policy")||l.includes("permission")||l.includes("not allowed")?new Error(`❌ PERMISSION DENIED

FIX:
1. Supabase Dashboard → Storage → materials
2. Tab Policies
3. Check authenticated users can INSERT
4. Or contact admin to setup RLS policies`):l.includes("limit")||l.includes("Limit")||l.includes("size")||l.includes("Size")?new Error(`❌ STORAGE LIMIT ERROR

Details: ${l}

FIX:
1. Check file size (yours is ${(s.size/1024/1024).toFixed(2)}MB)
2. Supabase bucket setting might be misconfigured
3. Admin should check: Storage → materials → Settings → file_size_limit
4. Should be at least 536870912 bytes (512MB)`):new Error(`❌ Upload Failed

Raw Error: ${l}

File size: ${(s.size/1024/1024).toFixed(2)}MB
File type: ${s.type||"unknown"}
File extension: ${u}`)}const{data:{publicUrl:N}}=c.storage.from("materials").getPublicUrl(b);n=N,d&&(d.textContent="✅ File uploaded successfully")}const i=document.getElementById("mat-id").value,a={module_id:document.getElementById("mat-mod-id").value,title:document.getElementById("mat-title").value,type:o,content:n,duration:parseInt(document.getElementById("mat-duration").value||"0"),order_no:parseInt(document.getElementById("mat-order").value||"0")};i&&i.trim()!==""&&(a.id=i);const{error:m}=await c.from("materials").upsert([a]);if(m)throw m;I(),x.reset(),d&&(d.textContent=""),p()}catch(i){console.error("Material submission error:",i),alert("Action failed: "+i.message),d&&(d.textContent="❌ Error: "+i.message)}};B("assignment-form","assignments",()=>({class_id:r,title:document.getElementById("ass-title").value,description:document.getElementById("ass-desc").value,deadline:document.getElementById("ass-deadline").value||null}));B("exam-form","exams",()=>({class_id:r,id:document.getElementById("ex-id").value||void 0,title:document.getElementById("ex-title").value,description:document.getElementById("ex-desc").value||null,duration:parseInt(document.getElementById("ex-duration").value),passing_score:parseInt(document.getElementById("ex-passing").value)||60,is_published:document.getElementById("ex-published").checked}));async function E(t,o,e){confirm(e)&&(await c.from(t).delete().eq("id",o),p())}p();
