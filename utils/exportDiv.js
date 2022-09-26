import html2canvas from "html2canvas";

const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement("a");
    fakeLink.style = "display:none;";
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
};

const exportAsImage = async (element, imageFileName) => {
    const el = element.innerHTML
    const html = document.getElementsByTagName("html")[0];
    const body = document.getElementsByTagName("body")[0];
    let htmlWidth = html.clientWidth;
    let bodyWidth = body.clientWidth;
    const newWidth = element.scrollWidth - element.clientWidth;
    if (newWidth > element.clientWidth) {
        htmlWidth += newWidth;
        bodyWidth += newWidth;
    }
    html.style.width = htmlWidth + "px";
    body.style.width = bodyWidth + "px";
    element.innerHTML += `<div style="
            width: 100%;
            margin: -2rem auto auto;
            /* right: 0rem; */
        "><p style="
            margin: auto;
            text-align: end;
            font-style: italic;
            font-size: small;
        ">&copy; gawe.fun</p></div>`;
    const canvas = await html2canvas(element);
    element.innerHTML = el
    // const fontHeight = 14;
    // const text = String("Data Column");
    // const context = canvas.getContext("2d");
    // context.font = "30px Arial";
    // context.strokeText("Text", 50, 50);

    const image = canvas.toDataURL("image/png", 1.0);
    downloadImage(image, imageFileName);
    html.style.width = null;
    body.style.width = null;
};
export default exportAsImage;