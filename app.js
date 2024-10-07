require('dotenv').config();
const { exec } = require('child_process');
const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const cron = require('cron');

// Membuat format tanggal untuk file backup
function getFormattedDate() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Bulan mulai dari 0
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}${min}`;
}

// Menggunakan variabel dari .env
const backupFile = process.env.BACKUP_FILE.replace('.sql', `${getFormattedDate()}.sql`);
const backupCommand = process.env.BACKUP_COMMAND.replace('.sql', `${getFormattedDate()}.sql`);
const nasPath = process.env.NAS_PATH.replace('.sql', `${getFormattedDate()}.sql`);
const nasHost = process.env.NAS_HOST;
const nasUsername = process.env.NAS_USERNAME;
const nasPassword = process.env.NAS_PASSWORD;

const sftp = new SftpClient();

// Cron job untuk menjalankan setiap hari jam 12:00 waktu WITA (Asia/Makassar)
const job = new cron.CronJob('06 06 12 * * *', function() {
    const now = new Date();
    const formattedTime = now.toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });

    console.log('---------------------MEMULAI PROSES BACKUP---------------------');
    console.log(`TANGGAL/JAM: ${formattedTime}`);

    // Step 1: Backup database
    exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Gagal backup database: ${error.message}`);
            return;
        }

        console.log('Backup database selesai... memulai koneksi ke NAS...');

        // Step 2: Copy file ke NAS via SFTP
        sftp.connect({
            host: nasHost,
            username: nasUsername,
            password: nasPassword,
        }).then(() => {
            console.log('Koneksi ke NAS sukses... memulai TF ke NAS');
            return sftp.put(backupFile, nasPath);
        }).then(() => {
            console.log('TF ke NAS selesai, menghapus file backup lokal...');

            // Step 3: Hapus file backup
            fs.unlink(backupFile, (err) => {
                if (err) {
                    console.error(`Gagal menghapus file backup: ${err.message}`);
                    return;
                }

                console.log('File backup lokal berhasil dihapus.');
                console.log('###############################################################');
                console.log('#                                                             #');
                console.log('#                       BACKUP SELESAI                        #');
                console.log('#                                                             #');
                console.log('###############################################################');
                console.log('');
            });
        }).catch(err => {
            console.error(`Gagal copy ke NAS: ${err.message}`);
        }).finally(() => {
            sftp.end();
        });
    });
}, null, true, 'Asia/Makassar');

// Mulai cron job
job.start();
