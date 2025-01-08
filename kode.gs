function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // If sheet is empty or only has headers
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Convert data to array of objects with proper property names
  const rentals = data.slice(1).map(row => ({
    "Nama": row[0],
    "KTP": row[1],
    "Telepon": row[2],
    "Kendaraan": row[3],
    "Tanggal Mulai": row[4],
    "Tanggal Selesai": row[5]
  }));
  
  return ContentService.createTextOutput(JSON.stringify(rentals))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Nama', 'KTP', 'Telepon', 'Kendaraan', 'Tanggal Mulai', 'Tanggal Selesai']);
    }
    
    // Add new row
    sheet.appendRow([
      data.Nama,
      data.KTP,
      data.Telepon,
      data.Kendaraan,
      data['Tanggal Mulai'],
      data['Tanggal Selesai']
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success',
      message: 'Data berhasil disimpan'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error',
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
