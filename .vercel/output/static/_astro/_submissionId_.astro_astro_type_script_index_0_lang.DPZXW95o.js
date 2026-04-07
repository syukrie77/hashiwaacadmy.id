import{s as u}from"./supabase.BC4iv9s-.js";const g=window.location.pathname.split("/"),y=g[3],b=g[5];let $=null,f=[],_=[],p="";async function h(){const{data:n,error:e}=await u.from("exam_submissions").select("*, users:user_id(name, email)").eq("id",b).single();if(e||!n){console.error("Submission load error:",e),document.getElementById("loading").textContent="Submission tidak ditemukan. Error: "+(e?.message||"Unknown");return}$=n,p=n.exam_id;const o=n.users?.name||n.users?.email||"Siswa";document.getElementById("page-title").textContent=`Koreksi: ${o}`,document.getElementById("student-info").textContent=`Dikumpulkan: ${n.submitted_at?new Date(n.submitted_at).toLocaleString("id-ID"):"-"}`,document.getElementById("back-link").setAttribute("href",`/instructor/courses/${y}/grading?examId=${p}`);let{data:a,error:t}=await u.from("questions").select("*, question_options(*)").eq("exam_id",p).order("order_no",{ascending:!0});if(t&&t.message?.includes("order_no")){console.warn("order_no column missing, retrying without order");const d=await u.from("questions").select("*, question_options(*)").eq("exam_id",p);a=d.data,t=d.error}if(t&&t.message?.includes("question_options")){console.warn("question_options join failed, retrying without join");const d=await u.from("questions").select("*").eq("exam_id",p);a=d.data,t=d.error}if(t){console.error("Questions load error:",t),document.getElementById("loading").textContent="Gagal memuat soal. Error: "+(t.message||"Unknown. Pastikan RLS tabel questions sudah di-fix (jalankan fix_exam_rls_for_students.sql).");return}f=a||[];let{data:i,error:s}=await u.from("submission_answers").select("*, question_options:selected_option_id(option_text)").eq("submission_id",b);if(s&&s.message?.includes("question_options")){console.warn("submission_answers join failed, retrying without join");const d=await u.from("submission_answers").select("*").eq("submission_id",b);i=d.data,s=d.error}if(s){console.error("Answers load error:",s),document.getElementById("loading").textContent="Gagal memuat jawaban. Error: "+(s.message||"Unknown. Pastikan RLS tabel submission_answers sudah di-fix.");return}_=i||[],document.getElementById("loading").classList.add("hidden"),document.getElementById("content").classList.remove("hidden"),E(),k()}function E(){const n=document.getElementById("answers-list");n.innerHTML=f.map((e,o)=>{const a=_.find(c=>c.question_id===e.id),t=e.type||"essay",i=e.points||10,s=a?.points_awarded,d=a?.feedback||"";let l="",r="";if(t==="multiple_choice"){const c=e.question_options?.find(w=>w.id===a?.selected_option_id),x=e.question_options?.find(w=>w.is_correct);l=c?c.option_text:"(Tidak dijawab)",a?.is_correct===!0?r=`<span class="auto-correct">✅ Benar - Otomatis +${s} poin</span>`:a?.is_correct===!1&&(r=`<span class="auto-wrong">❌ Salah - Jawaban benar: ${x?.option_text||"-"}</span>`)}else t==="true_false"?(l=a?.answer_text||"(Tidak dijawab)",r=a?.is_correct===!0?`<span class="auto-correct">✅ Benar - Otomatis +${s} poin</span>`:`<span class="auto-wrong">❌ Salah - Jawaban benar: ${e.correct_answer==="true"?"Benar":"Salah"}</span>`):l=a?.answer_text||"(Tidak dijawab)";const m=t==="essay";return`
                <div class="answer-card ${m?"essay-card":""} ${m&&s===null?"needs-grading":""}">
                    <div class="answer-header">
                        <div class="answer-num">${o+1}</div>
                        <div class="answer-type">
                            ${t==="multiple_choice"?"📋 Pilihan Ganda":t==="essay"?"✍️ Essay":"✅ Benar/Salah"}
                        </div>
                        <div class="answer-points">
                            <span class="max-points">Maks: ${i} poin</span>
                        </div>
                    </div>

                    <div class="question-text">${e.question}</div>

                    ${t==="multiple_choice"?`
                        <div class="options-review">
                            ${(e.question_options||[]).map(c=>`
                                <div class="opt-item ${c.is_correct?"opt-correct":""} ${c.id===a?.selected_option_id?"opt-selected":""}">
                                    ${c.is_correct?"✅":"○"} ${c.option_text}
                                    ${c.id===a?.selected_option_id?'<span class="student-pick">← Pilihan Siswa</span>':""}
                                </div>
                            `).join("")}
                        </div>
                    `:""}

                    <div class="student-answer">
                        <label>Jawaban Siswa:</label>
                        <div class="answer-content ${t==="essay"?"essay-answer":""}">${l}</div>
                    </div>

                    ${r?`<div class="auto-grade-result">${r}</div>`:""}

                    ${m?`
                        <div class="manual-grading">
                            <div class="grade-row">
                                <label for="points_${e.id}">Nilai (0 - ${i}):</label>
                                <input type="number" id="points_${e.id}" class="points-input"
                                    min="0" max="${i}" value="${s!==null?s:""}"
                                    data-question-id="${e.id}" data-max-points="${i}" />
                                <span class="points-suffix">/ ${i}</span>
                            </div>
                            <div class="feedback-row">
                                <label for="feedback_${e.id}">Feedback / Komentar:</label>
                                <textarea id="feedback_${e.id}" class="feedback-input"
                                    rows="2" placeholder="Tulis feedback untuk jawaban ini..."
                                    data-question-id="${e.id}">${d}</textarea>
                            </div>
                        </div>
                    `:`
                        <div class="mcq-feedback">
                            <label>Feedback (opsional):</label>
                            <textarea id="feedback_${e.id}" class="feedback-input"
                                rows="2" placeholder="Tambahkan komentar..."
                                data-question-id="${e.id}">${d}</textarea>
                        </div>
                    `}
                </div>
            `}).join(""),document.querySelectorAll(".points-input").forEach(e=>{e.oninput=()=>k()})}function k(){let n=0,e=0,o=!0;f.forEach(i=>{const s=i.points||10;e+=s;const d=_.find(r=>r.question_id===i.id);if(i.type==="essay"){const m=document.getElementById(`points_${i.id}`)?.value;m!==""&&m!==null?n+=Math.min(parseFloat(m),s):o=!1}else d?.points_awarded!==null&&d?.points_awarded!==void 0&&(n+=d.points_awarded)});const a=e>0?Math.round(n/e*100):0;document.getElementById("total-score").textContent=`${a}%`;const t=document.getElementById("auto-grade-info");o?t.innerHTML=`✅ Semua soal sudah dinilai. Total: <strong>${n}/${e}</strong>`:t.innerHTML=`⏳ Masih ada soal essay yang belum dinilai. Terisi: <strong>${n}/${e}</strong>`}document.getElementById("save-draft-btn").onclick=async()=>{await v(!1)};document.getElementById("submit-grades-btn").onclick=async()=>{let n=!0;for(const e of f)if(e.type==="essay"){const o=document.getElementById(`points_${e.id}`);if(!o?.value&&o?.value!=="0"){n=!1;break}}if(n){if(!confirm("Submit nilai ini? Siswa akan bisa melihat hasilnya di dashboard."))return}else if(!confirm("Masih ada soal essay yang belum dinilai. Yakin ingin submit? Soal yang belum dinilai akan mendapat 0 poin."))return;await v(!0)};async function v(n){const e=n?document.getElementById("submit-grades-btn"):document.getElementById("save-draft-btn");e.textContent="Menyimpan...",e.disabled=!0;try{for(const o of f){const a=_.find(s=>s.question_id===o.id);if(!a)continue;const i=document.getElementById(`feedback_${o.id}`)?.value||"";if(o.type==="essay"){const s=document.getElementById(`points_${o.id}`),d=s?.value?parseFloat(s.value):null,l=o.points||10,r={feedback:i||null};d!==null&&(r.points_awarded=Math.min(d,l),r.is_correct=d>=l*.5),await u.from("submission_answers").update(r).eq("id",a.id)}else i&&await u.from("submission_answers").update({feedback:i}).eq("id",a.id)}if(n){let o=0,a=0;for(const i of f){const s=i.points||10;a+=s;const d=_.find(l=>l.question_id===i.id);if(i.type==="essay"){const l=document.getElementById(`points_${i.id}`),r=l?.value?parseFloat(l.value):0;o+=Math.min(r,s)}else o+=d?.points_awarded||0}const t=a>0?Math.round(o/a*100):0;await u.from("exam_submissions").update({status:"graded",score:t,graded_at:new Date().toISOString(),graded_by:JSON.parse(document.getElementById("user-data").dataset.user||"{}").id}).eq("id",b),await u.from("results").upsert({exam_id:p,user_id:$.user_id,score:t},{onConflict:"exam_id, user_id"}),alert(`Nilai berhasil disubmit! Skor akhir: ${t}%`)}else alert("Draft berhasil disimpan.");window.location.href=`/instructor/courses/${y}/grading?examId=${p}`}catch(o){alert("Error: "+(o.message||"Gagal menyimpan")),e.disabled=!1,e.textContent=n?"✅ Submit Nilai & Kirim ke Siswa":"Simpan Draft"}}h();
