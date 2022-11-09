// Thêm sự kiện khi thay đổi kiểu logo (hình hoặc chữ)
document.querySelectorAll("input[name='logoType']").forEach((elm) => {
  elm.addEventListener('click', (e) => {
    if (elm.id === 'imageLogo') {
      document.getElementById('logo-text-container').style.display = 'none';
      document.getElementById('logo-image-container').style.display = 'block';
      document.getElementById('rounded-logo-container').style.display = 'block';
      document.getElementById('logo-image-size-container').style.display =
        'block';
      document.getElementById('opacity-container').style.display = 'block';
      document.getElementById('font-size-container').style.display = 'none';
      document.getElementById('text-color-container').style.display = 'none';
    } else {
      document.getElementById('logo-text-container').style.display = 'block';
      document.getElementById('logo-image-container').style.display = 'none';
      document.getElementById('rounded-logo-container').style.display = 'none';
      document.getElementById('logo-image-size-container').style.display =
        'none';
      document.getElementById('opacity-container').style.display = 'none';
      document.getElementById('font-size-container').style.display = 'block';
      document.getElementById('text-color-container').style.display = 'block';
    }
  });
});

// Hiển thị đường dẫn thư mục lưu hình ảnh sau khi chèn logo
const destinationBtn = document.getElementById('destination');
const destinationPathElement = document.getElementById('destinationPath');
destinationBtn.addEventListener('click', async () => {
  const destinationPath = await window.electron.openDirectory();
  destinationPathElement.innerText = destinationPath;
});

const isImageLogo =
  document.querySelector("input[name='logoType']:checked").id === 'imageLogo';
const handleAddLogo = async (event) => {
  event.preventDefault();

  let images = [];
  Array.from(document.getElementById('images').files).forEach((file) => {
    images.push(file.path);
  });

  const logo = isImageLogo
    ? document.querySelector('#image-logo-input').files[0].path
    : document.querySelector('#text-logo-input').value;

  const logoType = document.querySelector("input[name='logoType']:checked").id;

  const roundedLogo = document.querySelector('#roundedLogo').checked;
  const position = document.querySelector(
    "input[name='logoPosition']:checked"
  ).id;
  const opacity = document.querySelector('#opacity')?.value;
  const logoWidth = document.querySelector('#logoWidth').value;
  const logoHeight = document.querySelector('#logoHeight').value;
  const fontSize = document.querySelector(
    "input[name='fontSize']:checked"
  )?.value;
  const textColor = document.querySelector(
    "input[name='textColor']:checked"
  )?.value;

  const destination = document
    .querySelector('#destinationPath')
    .innerText.replaceAll('\\', '/');

  const addLogoSuccessfully = await window.electron.addLogoToImage({
    images,
    logoType,
    logo,
    roundedLogo,
    position,
    opacity: +opacity,
    fontSize,
    textColor,
    logoWidth: +logoWidth,
    logoHeight: +logoHeight,
    destination,
  });

  // if (addLogoSuccessfully) {
  //   document.getElementById(
  //     'status'
  //   ).innerText = `Thêm logo thành công! Vào đường dẫn ${destination} để kiểm tra.`;
  // } else {
  //   document.getElementById(
  //     'status'
  //   ).innerText = `Thêm logo thất bại! Vui lòng thử lại sau.`;
  // }
};

const addLogoBtn = document.getElementById('addLogoBtn');
addLogoBtn.addEventListener('click', handleAddLogo);
