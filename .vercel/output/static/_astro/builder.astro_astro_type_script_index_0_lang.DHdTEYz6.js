import{s as m}from"./supabase.B_4TCqGZ.js";const w=window.location.pathname.split("/"),r=w[w.length-2],S=document.getElementById("user-data"),$=S?S.dataset.user:null;(!$||JSON.parse($).role!=="admin")&&(window.location.href="/login");async function O(){const{data:t}=await m.from("classes").select("*").eq("id",r).single(),{data:o}=await m.from("modules").select("*").eq("class_id",r).order("order_no"),{data:e}=await m.from("materials").select("*, modules!inner(class_id)").eq("modules.class_id",r).order("order_no"),{data:a}=await m.from("assignments").select("*").eq("class_id",r),{data:n}=await m.from("exams").select("*").eq("class_id",r);return{course:t,modules:o,materials:e,assignments:a,exams:n}}function R(t){t.course&&(document.getElementById("course-title").textContent=t.course.title,document.getElementById("course-desc").textContent=t.course.description,z(t),P(t),U(t))}function z(t){const o=document.getElementById("modules-list");if(o){if(o.innerHTML="",!t.modules||t.modules.length===0){o.innerHTML='<div class="empty-state">No modules yet.</div>';return}t.modules.forEach(e=>{const a=document.createElement("div");a.className="module-card",a.innerHTML=`
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
            `,o.appendChild(a);const n=a.querySelector(`#m-list-${e.id}`);(t.materials||[]).filter(d=>d.module_id===e.id).forEach(d=>{const c=document.createElement("li");c.innerHTML=`
                    <div class="mat-info">
                        <span class="type-icon">${d.type==="video"?"📽️":d.type==="pdf"?"📄":"📝"}</span>
                        <span class="mat-name">${d.title}</span>
                        <span class="mat-order">Order: ${d.order_no}</span>
                    </div>
                    <div>
                        <button class="edit-mat" data-id="${d.id}">✏️</button>
                        <button class="delete-mat" data-id="${d.id}">🗑️</button>
                    </div>
                `,n&&n.appendChild(c)})}),document.querySelectorAll(".delete-mod").forEach(e=>e.onclick=()=>p("modules",e.dataset.id,"Delete module and materials?")),document.querySelectorAll(".delete-mat").forEach(e=>e.onclick=()=>p("materials",e.dataset.id,"Delete material?")),document.querySelectorAll(".add-mat").forEach(e=>{e.onclick=()=>{document.getElementById("material-form").reset(),document.getElementById("mat-id").value="",document.getElementById("upload-status").textContent="",y();const n=document.getElementById("mat-mod-id");n&&(n.value=e.dataset.id),document.getElementById("material-modal")?.classList.remove("hidden")}}),document.querySelectorAll(".edit-mod").forEach(e=>{e.onclick=()=>{const a=e.dataset.id,n=t.modules.find(i=>i.id===a);n&&(document.getElementById("module-form").reset(),document.getElementById("module-id").value=n.id,document.getElementById("m-title").value=n.title,document.getElementById("m-order").value=n.order_no||0,g("module-modal"))}}),document.querySelectorAll(".edit-mat").forEach(e=>{e.onclick=()=>{const a=e.dataset.id,n=(t.materials||[]).find(i=>i.id===a);if(n){document.getElementById("material-form").reset(),document.getElementById("mat-id").value=n.id,document.getElementById("mat-mod-id").value=n.module_id,document.getElementById("mat-title").value=n.title,document.getElementById("mat-type").value=n.type,document.getElementById("mat-order").value=n.order_no||0,document.getElementById("mat-duration").value=n.duration||0;const d=document.getElementById("mat-content")?.parentElement,c=document.getElementById("file-upload-group");if(document.getElementById("mat-type").dispatchEvent(new Event("change")),n.type==="text")document.getElementById("mat-content").value=n.content,c?.classList.add("hidden"),d?.classList.remove("hidden"),setTimeout(L,100);else{c?.classList.remove("hidden"),d?.classList.add("hidden");const v=document.getElementById("upload-status");v&&(v.textContent="Current file: "+(n.content?"Uploaded":"None")),document.getElementById("mat-content").value=n.content||""}g("material-modal")}}})}}function P(t){const o=document.getElementById("assignments-list");o&&(o.innerHTML=(t.assignments||[]).map(e=>`
            <div class="item-row">
                <div class="item-info">
                    <h4>${e.title}</h4>
                    <span class="muted">Deadline: ${e.deadline?new Date(e.deadline).toLocaleString():"No deadline"}</span>
                </div>
                <button class="btn-sm danger delete-ass" data-id="${e.id}">Delete</button>
            </div>
        `).join("")||'<div class="empty-state">No assignments yet.</div>',document.querySelectorAll(".delete-ass").forEach(e=>e.onclick=()=>p("assignments",e.dataset.id,"Delete assignment?")))}function U(t){const o=document.getElementById("exams-list");o&&(o.innerHTML=(t.exams||[]).map(e=>`
            <div class="item-row">
                <div class="item-info">
                    <h4>${e.title}</h4>
                    <span class="muted">Duration: ${e.duration} mins</span>
                </div>
                <div class="actions">
                    <a href="/admin/courses/${r}/exams/${e.id}" class="btn-sm btn-outline">Edit Questions</a>
                    <button class="btn-sm danger delete-ex" data-id="${e.id}">Delete</button>
                </div>
            </div>
        `).join("")||'<div class="empty-state">No exams yet.</div>',document.querySelectorAll(".delete-ex").forEach(e=>e.onclick=()=>p("exams",e.dataset.id,"Delete exam?")))}async function E(){const t=await O();R(t),document.getElementById("loading").style.display="none",document.getElementById("builder-content").classList.remove("hidden")}document.querySelectorAll(".tab-btn").forEach(t=>{t.onclick=()=>{document.querySelectorAll(".tab-btn").forEach(o=>o.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(o=>o.classList.remove("active")),t.classList.add("active"),document.getElementById(`tab-${t.dataset.tab}`)?.classList.add("active")}});const g=t=>document.getElementById(t)?.classList.remove("hidden"),h=()=>{document.querySelectorAll(".modal").forEach(t=>t.classList.add("hidden")),typeof y=="function"&&y()};document.getElementById("add-module-btn").onclick=()=>{document.getElementById("module-form").reset(),document.getElementById("module-id").value="",g("module-modal")};document.getElementById("add-assignment-btn").onclick=()=>g("assignment-modal");document.getElementById("add-exam-btn").onclick=()=>g("exam-modal");document.querySelectorAll(".closeModal").forEach(t=>t.onclick=h);const B=async(t,o,e,a)=>{const n=document.getElementById(t);n.onsubmit=async i=>{i.preventDefault();const d=e();d.id||delete d.id,tinymce.get("mat-content")&&(document.getElementById("mat-content").value=tinymce.get("mat-content").getContent());const{error:c}=await m.from(o).upsert(d);c||(h(),n.reset(),E())}};B("module-form","modules",()=>({class_id:r,id:document.getElementById("module-id").value,title:document.getElementById("m-title").value,price:parseFloat(document.getElementById("m-price").value),order_no:document.getElementById("m-order").value}));const x=document.getElementById("material-form"),I=document.getElementById("mat-type"),k=document.getElementById("file-upload-group"),M=document.getElementById("mat-content")?.parentElement,L=()=>{tinymce.get("mat-content")||tinymce.init({selector:"#mat-content",plugins:"advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount",toolbar:"undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",height:300,setup:function(t){t.on("change",function(){t.save()})}})},y=()=>{tinymce.get("mat-content")&&tinymce.get("mat-content").remove()};I.onchange=()=>{const t=I.value;if(t==="text")k?.classList.add("hidden"),M?.classList.remove("hidden"),L();else{k?.classList.remove("hidden"),M?.classList.add("hidden");const o=document.getElementById("mat-file");t==="video"?o.accept="video/*":t==="pdf"&&(o.accept=".pdf"),y()}};x.onsubmit=async t=>{t.preventDefault();const o=I.value,e=document.getElementById("mat-file"),a=document.getElementById("upload-status");let n="";o==="text"&&tinymce.get("mat-content")?n=tinymce.get("mat-content").getContent():n=document.getElementById("mat-content").value;try{if(o!=="text"&&e.files?.length){const l=e.files[0],u=l.name.toLowerCase().split(".").pop()||"unknown",D=["video/mp4","video/webm","video/ogg","video/quicktime"],F=["mp4","webm","ogg","mov","avi","mkv"],C=["application/pdf"],_=["pdf"];if(o==="video"){if(!D.includes(l.type)&&!F.includes(u))throw new Error(`❌ Format video tidak valid.

Format yang didukung: MP4, WebM, OGG, MOV
File Anda: ${l.type||u}`)}else if(o==="pdf"&&!C.includes(l.type)&&!_.includes(u))throw new Error(`❌ Format file bukan PDF.

File Anda: ${l.type||u}`);const q=o==="video"?500*1024*1024:50*1024*1024,A=o==="video"?500:50;if(l.size>q)throw new Error(`❌ Ukuran file terlalu besar!

Maksimal: ${A}MB
File Anda: ${(l.size/1024/1024).toFixed(2)}MB`);a&&(a.textContent=`Mengupload ${o==="video"?"video":"PDF"} (${(l.size/1024/1024).toFixed(1)}MB)...`);const T=`${Date.now()}_${Math.random().toString(36).substring(7)}.${u}`,b=`${r}/${T}`,{data:G,error:f}=await m.storage.from("materials").upload(b,l,{cacheControl:"3600",upsert:!1});if(f){console.error("=== UPLOAD ERROR DEBUG ==="),console.error("Error object:",f),console.error("Error message:",f.message),console.error("Error status:",f.status),console.error("Full error:",JSON.stringify(f)),console.error("========================");const s=f.message||"Unknown upload error";throw s.includes("Bucket")&&s.includes("not found")?new Error(`❌ Storage bucket 'materials' NOT FOUND

FIX:
1. Supabase Dashboard → Storage
2. + New Bucket → Name: materials
3. Check 'Make it public'
4. Create → Refresh page`):s.includes("policy")||s.includes("permission")||s.includes("not allowed")?new Error(`❌ PERMISSION DENIED

FIX:
1. Supabase Dashboard → Storage → materials
2. Tab Policies
3. Check authenticated users can INSERT
4. Or contact admin to setup RLS policies`):s.includes("limit")||s.includes("Limit")||s.includes("size")||s.includes("Size")?new Error(`❌ STORAGE LIMIT ERROR

Details: ${s}

FIX:
1. Check file size (yours is ${(l.size/1024/1024).toFixed(2)}MB)
2. Supabase bucket setting might be misconfigured
3. Admin should check: Storage → materials → Settings → file_size_limit
4. Should be at least 536870912 bytes (512MB)`):new Error(`❌ Upload Failed

Raw Error: ${s}

File size: ${(l.size/1024/1024).toFixed(2)}MB
File type: ${l.type||"unknown"}
File extension: ${u}`)}const{data:{publicUrl:N}}=m.storage.from("materials").getPublicUrl(b);n=N,a&&(a.textContent="✅ File uploaded successfully")}const i=document.getElementById("mat-id").value,d={module_id:document.getElementById("mat-mod-id").value,title:document.getElementById("mat-title").value,type:o,content:n,duration:parseInt(document.getElementById("mat-duration").value||"0"),order_no:parseInt(document.getElementById("mat-order").value||"0")};i&&i.trim()!==""&&(d.id=i);const{error:c}=await m.from("materials").upsert([d]);if(c)throw c;h(),x.reset(),a&&(a.textContent=""),E()}catch(i){console.error("Material submission error:",i),alert("Action failed: "+i.message),a&&(a.textContent="❌ Error: "+i.message)}};B("assignment-form","assignments",()=>({class_id:r,title:document.getElementById("ass-title").value,description:document.getElementById("ass-desc").value,deadline:document.getElementById("ass-deadline").value||null}));B("exam-form","exams",()=>({class_id:r,title:document.getElementById("ex-title").value,duration:parseInt(document.getElementById("ex-duration").value)}));async function p(t,o,e){confirm(e)&&(await m.from(t).delete().eq("id",o),E())}E();
