import{s as i}from"./supabase.BC4iv9s-.js";const l=window.location.pathname.split("/"),c=l[l.length-2],u=document.getElementById("user-data"),m=u?u.dataset.user:null,r=document.getElementById("students-tbody"),p=document.getElementById("loading"),w=document.getElementById("empty-state"),f=document.getElementById("course-title"),g=document.getElementById("student-search");let o=[];if(!m)window.location.href="/login";else{const t=JSON.parse(m);t.role!=="instructor"?window.location.href="/dashboard":y(t)}async function y(t){const{data:e,error:a}=await i.from("classes").select("title, owner_id").eq("id",c).single();if(a||!e){alert("Course tidak ditemukan."),window.location.href="/instructor/dashboard";return}if(e.owner_id!==t.id){alert("Akses ditolak. Anda bukan pemilik course ini."),window.location.href="/instructor/dashboard";return}f.textContent=e.title;try{const{data:n,error:d}=await i.from("enrollments").select(`
                    created_at,
                    status,
                    users (id, name, email)
                `).eq("class_id",c).order("created_at",{ascending:!1});if(d)throw d;if(p.style.display="none",!n||n.length===0){w.classList.remove("hidden");return}o=n.map(s=>({name:s.users?.name||"Unknown",email:s.users?.email||"-",joinedAt:s.created_at,status:s.status||"active"})),h(o)}catch(n){console.error(n),p.textContent="Error memuat data siswa."}}function h(t){if(r.innerHTML="",t.length===0){r.innerHTML='<tr><td colspan="4" style="text-align:center; padding: 2rem;">Tidak ada data siswa.</td></tr>';return}t.forEach(e=>{const a=document.createElement("tr");a.innerHTML=`
                <td>
                    <div class="student-info">
                        <div class="avatar-placeholder">${e.name.charAt(0).toUpperCase()}</div>
                        <span class="student-name">${e.name}</span>
                    </div>
                </td>
                <td>${e.email}</td>
                <td>${new Date(e.joinedAt).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</td>
                <td>
                    <span class="status-badge ${e.status}">${e.status}</span>
                </td>
            `,r?.appendChild(a)})}g?.addEventListener("input",t=>{const e=t.target.value.toLowerCase(),a=o.filter(n=>n.name.toLowerCase().includes(e)||n.email.toLowerCase().includes(e));h(a)});
