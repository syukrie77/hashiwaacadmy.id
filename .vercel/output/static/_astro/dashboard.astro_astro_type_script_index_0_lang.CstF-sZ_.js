import{s as a}from"./supabase.B_4TCqGZ.js";const i=document.getElementById("user-data"),c=i?i.dataset.user:null,r=document.getElementById("loading"),d=document.getElementById("dashboard-content"),E=document.getElementById("courses-grid"),v=document.getElementById("no-courses"),l=document.getElementById("stat-students"),u=document.getElementById("stat-active-courses"),m=document.getElementById("stat-modules"),h=document.getElementById("stat-materials");if(!c)window.location.href="/login";else{const e=JSON.parse(c);e.role!=="instructor"?(alert("Akses ditolak. Halaman ini khusus untuk Instructor."),window.location.href="/dashboard"):y(e)}async function y(e){try{console.log("Dashboard - Current User:",e);const{data:t,error:s}=await a.from("classes").select("*").eq("owner_id",e.id).order("title");if(s)throw console.error("Dashboard - Error fetching courses:",s),s;if(console.log("Dashboard - Courses fetched:",t),!t||t.length===0){console.warn("Dashboard - No courses found for this user."),r.style.display="none",d.classList.remove("hidden"),v.classList.remove("hidden");return}const o=t.map(n=>n.id),{count:f}=await a.from("enrollments").select("*",{count:"exact",head:!0}).in("class_id",o),{count:g}=await a.from("modules").select("*",{count:"exact",head:!0}).in("class_id",o),{count:p}=await a.from("materials").select("id, modules!inner(class_id)",{count:"exact",head:!0}).in("modules.class_id",o);l&&(l.textContent=f?.toString()||"0"),u&&(u.textContent=t.filter(n=>n.is_active).length.toString()),m&&(m.textContent=g?.toString()||"0"),h&&(h.textContent=p?.toString()||"0"),r.style.display="none",d.classList.remove("hidden"),b(t)}catch(t){console.error(t),alert("Error memuat data dashboard"),r.textContent="Gagal memuat data."}}function b(e){e.forEach(t=>{const s=document.createElement("div");s.className="course-card",s.innerHTML=`
                <div class="course-info">
                    <h4>${t.title}</h4>
                    <p class="muted">${t.description||"Tidak ada deskripsi"}</p>
                    <div class="course-meta">
                        <span class="badge ${t.is_active?"active":"inactive"}">
                            ${t.is_active?"Aktif":"Draft"}
                        </span>
                        ${t.price>0?`<span class="price">Rp ${t.price.toLocaleString("id-ID")}</span>`:'<span class="price free">Gratis</span>'}
                    </div>
                </div>
                <div class="course-actions">
                    <a href="/instructor/courses/${t.id}/builder" class="btn btn-primary">
                        Kelola Materi
                    </a>
                    <a href="/instructor/courses/${t.id}/students" class="btn btn-outline">
                        Lihat Siswa
                    </a>
                </div>
            `,E?.appendChild(s)})}
