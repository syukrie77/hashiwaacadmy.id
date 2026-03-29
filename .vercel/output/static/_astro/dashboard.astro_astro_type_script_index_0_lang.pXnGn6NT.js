import{s as l}from"./supabase.B_4TCqGZ.js";const d=document.getElementById("user-data"),c=d?d.dataset.user:null,g=document.getElementById("loading"),a=document.getElementById("dashboard-content"),i=document.getElementById("user-name"),y=document.getElementById("enrollments-grid"),h=document.getElementById("no-enrollments"),E=document.getElementById("results-list"),f=document.getElementById("no-results"),m=document.getElementById("stat-courses"),u=document.getElementById("stat-exams"),p=document.getElementById("logout-btn");if(!c)window.location.href="/login";else{const t=JSON.parse(c);if(i&&(i.textContent=t.name),t.role==="admin"){const e=document.createElement("div");e.style.padding="1rem",e.style.background="#fee2e2",e.style.color="#991b1b",e.style.marginBottom="1rem",e.style.borderRadius="0.5rem",e.innerHTML='<strong>Admin detected:</strong> <a href="/admin/dashboard" style="text-decoration: underline; color: inherit;">Manage Platform</a>',a?.prepend(e)}if(t.role==="instructor"){const e=document.createElement("div");e.style.padding="1rem",e.style.background="#d1fae5",e.style.color="#065f46",e.style.marginBottom="1rem",e.style.borderRadius="0.5rem",e.innerHTML='<strong>Instructor:</strong> <a href="/instructor/dashboard" style="text-decoration: underline; color: inherit;">Kelola Course Anda</a>',a?.prepend(e)}b(t)}p?.addEventListener("click",async()=>{try{await fetch("/api/auth/logout",{method:"POST"}),localStorage.removeItem("user"),window.location.href="/"}catch(t){console.error(t)}});async function b(t){try{const{data:e,error:B}=await l.from("enrollments").select(`
          status,
          classes (id, title, description, price)
        `).eq("user_id",t.id),{data:o,error:I}=await l.from("results").select(`
          score,
          exams (title)
        `).eq("user_id",t.id).order("id",{ascending:!1}).limit(5);g.style.display="none",a.classList.remove("hidden"),m&&(m.textContent=e?.length.toString()||"0"),u&&(u.textContent=o?.length.toString()||"0"),!e||e.length===0?h.classList.remove("hidden"):e.forEach(n=>{const s=n.classes;if(!s)return;const r=document.createElement("div");r.className="course-card-compact",r.innerHTML=`
            <div class="content">
              <h4>${s.title}</h4>
              <div class="badge status-${n.status}">${n.status}</div>
            </div>
            <a href="/courses/${s.id}" class="btn btn-sm btn-primary">Go to Class</a>
          `,y?.appendChild(r)}),o&&o.length>0&&(f.classList.add("hidden"),o.forEach(n=>{const s=document.createElement("li");s.innerHTML=`
            <span class="exam-name">${n.exams.title}</span>
            <span class="score ${n.score>=70?"pass":"fail"}">${n.score}%</span>
          `,E?.appendChild(s)}))}catch(e){console.error(e)}}
