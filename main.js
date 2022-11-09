const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const Jimp = require('jimp');

const handleDirectoryOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
  });
  if (canceled) {
    return '';
  } else {
    return filePaths[0];
  }
};

const addImageLogo = async (image, logo, data) => {
  // điều chỉnh hình logo
  const adjustedLogo = logo
    .resize(
      image.bitmap.width * (data.logoWidth / 100),
      image.bitmap.width * (data.logoHeight / 100)
    )
    .opacity(data.opacity);

  // thêm logo vào hình
  let marginLeft, marginTop;
  switch (data.position) {
    case 'topleft':
      marginLeft = 10;
      marginTop = 10;
      break;
    case 'topright':
      marginLeft = image.bitmap.width - adjustedLogo.bitmap.width - 10;
      marginTop = 10;
      break;
    case 'bottomleft':
      marginLeft = 10;
      marginTop = image.bitmap.height - adjustedLogo.bitmap.height - 10;
      break;
    case 'bottomright':
      marginLeft = image.bitmap.width - adjustedLogo.bitmap.width - 10;
      marginTop = image.bitmap.height - adjustedLogo.bitmap.height - 10;
      break;
    case 'center':
      marginLeft = image.bitmap.width / 2 - adjustedLogo.bitmap.width / 2;
      marginTop = image.bitmap.height / 2 - adjustedLogo.bitmap.height / 2;
      break;
    default:
      break;
  }

  // Làm tròn logo
  if (data.roundedLogo) {
    const mask = (await Jimp.read('./img/circle.png')).resize(
      image.bitmap.width * (data.logoWidth / 100),
      image.bitmap.width * (data.logoHeight / 100)
    );

    adjustedLogo.mask(mask, 0, 0);
  }

  // thêm logo
  image.composite(adjustedLogo, marginLeft, marginTop);

  return image;
};

const addTextLogo = async (image, data) => {
  console.log(data.fontSize, data.textColor);
  const font = await Jimp.loadFont(
    Jimp[`FONT_SANS_${data.fontSize}_${data.textColor}`]
  );

  // set vị trí của logo
  let marginLeft, marginTop;
  switch (data.position) {
    case 'topleft':
      marginLeft = 10;
      marginTop = 10;
      break;
    case 'topright':
      marginLeft = image.bitmap.width - adjustedLogo.bitmap.width - 10;
      marginTop = 10;
      break;
    case 'bottomleft':
      marginLeft = 10;
      marginTop = image.bitmap.height - adjustedLogo.bitmap.height - 10;
      break;
    case 'bottomright':
      marginLeft = image.bitmap.width - adjustedLogo.bitmap.width - 10;
      marginTop = image.bitmap.height - adjustedLogo.bitmap.height - 10;
      break;
    case 'center':
      marginLeft = image.bitmap.width / 2 - adjustedLogo.bitmap.width / 2;
      marginTop = image.bitmap.height / 2 - adjustedLogo.bitmap.height / 2;
      break;
    default:
      break;
  }

  // thêm logo
  image.print(font, marginLeft, marginTop, data.logo);

  return image;
};

// XỬ LÝ THÊM LOGO
const handleAddLogo = async (data) => {
  let logo;
  if (data.logoType === 'imageLogo') {
    logo = await Jimp.read(data.logo);
  }

  for (const imagePath of data.images) {
    let image = await Jimp.read(imagePath);

    // thêm logo
    if (data.logoType === 'imageLogo') {
      image = await addImageLogo(image, logo, data);
    } else {
      image = await addTextLogo(image, data);
    }

    // lưu ảnh đã thêm logo vào máy
    const watermarkedFileName =
      imagePath.slice(imagePath.lastIndexOf('\\'), imagePath.indexOf('.jpg')) +
      Date.now() +
      Math.random();
    image.write(`${data.destination}/${watermarkedFileName}.jpg`);
  }
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  ipcMain.handle('dialog:openDirectory', handleDirectoryOpen);

  ipcMain.handle('addLogoToImage', (event, data) => {
    handleAddLogo(data);
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('active', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    app.quit();
  }
});
