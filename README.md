# Database Backup to NAS with Node.js

This project automates the process of backing up a MySQL database and transferring the backup file to a NAS server via SFTP. The project runs on a scheduled basis using the `cron` package and can be customized using environment variables defined in a `.env` file.

## Features
- Backup MySQL database.
- Transfer backup file to NAS via SFTP.
- Scheduled using cron jobs (set to run daily at 12:00 WITA).
- Automatically deletes the local backup file after successful transfer to NAS.
- Easy configuration through `.env` file.

## Prerequisites
- Node.js
- MySQL installed (for database access)
- Access to a NAS server with SFTP

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository-link.git
   cd your-repository-folder

2. Install dependencies:
    npm install

3. Create a .env file in the root directory with the following structure:
    # Path for transfer to NAS
    NAS_PATH=/lokasi/server/NAS/kamu/templatenamafile.sql

    # NAS connection details
    NAS_HOST= 
    NAS_USERNAME= 
    NAS_PASSWORD=  # Replace with your actual password tambahkan "..." jika mengandung spesial karakter

    # MySQL backup command (customize as needed)
    BACKUP_COMMAND=cd /lokasi/server/DB/kamu/ && mysqldump -u root --password=yourpassword nama_DB > /lokasi/penyimpanan/file/backup/templatenamafile.sql

    # Local path for backup file
    BACKUP_FILE=/lokasi/penyimpanan/file/backup/templatenamafile.sql

4. Start the service manually:
    node app.js

Running as a Scheduled Task
The project uses cron to schedule the backup process. By default, it is set to run every day at 12:00 WITA. You can modify the schedule by adjusting the cron pattern in app.js.