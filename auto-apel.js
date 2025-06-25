(function(){
  if (document.getElementById('ek-form')) return;

  const namaHari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const form = document.createElement("div");
  form.id = "ek-form";
  form.style = "position:fixed;top:10%;left:50%;transform:translateX(-50%);z-index:9999;background:#fff;padding:15px;border:1px solid #ccc;box-shadow:0 0 10px rgba(0,0,0,0.3);width:400px;font-family:sans-serif";

  const isi = `
    <h3 style='margin-top:0;'>Apel Pagi e-Kinerja</h3>
    <label>Pilih tanggal (Senin–Jumat):<br/>
      <select id="ek-tanggal" multiple size="10" style="width:100%;margin-top:5px"></select>
    </label><br/>
    <button id="ek-kirim">Kirim Semua</button>
    <button onclick="document.getElementById('ek-form').remove()">Tutup</button>
    <pre id="ek-log" style="background:#f9f9f9;padding:8px;margin-top:10px;height:150px;overflow:auto;font-size:12px"></pre>
  `;
  form.innerHTML = isi;
  document.body.appendChild(form);

  // ✅ Isi dropdown semua hari kerja dari 1 Januari hingga hari ini
  const sel = document.getElementById("ek-tanggal");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalisasi jam 00:00

  const start = new Date(today.getFullYear(), today.getMonth(), 1); // Awal bulan ini

  for (let i = 0; ; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d > today) break;

    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      const val = d.toISOString().split('T')[0];
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = `${val} (${namaHari[day]})`;
      sel.appendChild(opt);
    }
  }

  // 🧠 Tombol Kirim
  document.getElementById("ek-kirim").onclick = () => {
    const log = document.getElementById("ek-log");
    log.textContent = "";
    const tanggalList = Array.from(sel.selectedOptions).map(opt => opt.value);
    if (tanggalList.length === 0) return alert("Pilih minimal satu tanggal terlebih dahulu!");

    tanggalList.forEach(tgl => {
      const data = {
        tanggal: tgl,
        parent_pekerjaan: "1",
        nama_pekerjaan: "2",
        mulai_waktu: "07:30",
        selesai_waktu: "07:45",
        uraian_pekerjaan: "Melaksanakan Apel Pagi",
        id_data_kinerja: ""
      };

      fetch("https://tukin.kebumenkab.go.id/rekam/saveAktivitas", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      })
      .then(r => r.text())
      .then(res => {
        log.textContent += `✅ ${tgl} → Terkirim\n`;
      })
      .catch(e => {
        log.textContent += `❌ ${tgl} → Gagal: ${e}\n`;
      });
    });
  };
})();
