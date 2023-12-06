let table;
let tabSize;
let tabText;
let tabContent;
let tabSender;
let tabRecipient;
let tabSubject;
let tabDate;
let xCanvasSize = 960;
let yCanvasSize = 640;
let textObjects = [];
let selectedTextIndex = -1; // Default, no text is selected
let mailContentScrollY = 0;
let quitButtonX = 890;
let quitButtonY = 20;
let quitButtonWidth = 60;
let quitButtonHeight = 30;
let textArea;
let mailContentVisible = false;

function preload() {
  table = loadTable('assets/numbers.csv', 'csv', 'header');
}

function setup() {
  createCanvas(xCanvasSize, yCanvasSize);

  tabSize = table.getColumn('Size');
  tabText = table.getColumn('Preview');
  tabContent = table.getColumn('Content');
  tabSender = table.getColumn('Sender');
  tabRecipient = table.getColumn('Recipient');
  tabSubject = table.getColumn('Subject');
  tabDate = table.getColumn('Date');

  let numberOfColumns = table.getRowCount();

  if (numberOfColumns === 0) {
    console.error("No data in the table.");
    return;
  }

  noStroke();

  for (let i = 0; i < numberOfColumns; i++) {
    let posx = random(0, width);
    let posy = random(0, height);
    let textSpeed = random(0.5, 1.8);
    let textSizeVal = 3.5 * log(tabSize[i] + 1);
    let textPreview = tabText[i];
    textSize(textSizeVal);
    let textWidthVal = textWidth(textPreview);
    textObjects.push({ posX: posx, posY: posy, preview: textPreview, textWidth: textWidthVal, textSize: textSizeVal, speed: textSpeed, direction: random([-1, 1]) });
  }
}

function draw() {
  background(0, 25, 10);
  textAlign(CENTER);

  let numberOfColumns = textObjects.length;

  for (let i = 0; i < numberOfColumns; i++) {
    // Calculate horizontal position based on time
    textObjects[i].posX += textObjects[i].direction * textObjects[i].speed;

    // If the center of the text goes completely off the screen, reset its position on the other side
    if (
      (textObjects[i].direction === 1 && textObjects[i].posX - textObjects[i].textWidth / 2 > width) ||
      (textObjects[i].direction === -1 && textObjects[i].posX + textObjects[i].textWidth / 2 < 0)
    ) {
      textObjects[i].posX = textObjects[i].direction === 1 ? -textObjects[i].textWidth / 2 : width + textObjects[i].textWidth / 2;
    }

    fill(255, 255, 255, 100);
    rect(textObjects[i].posX - textObjects[i].textWidth / 2, textObjects[i].posY - textObjects[i].textSize * 3 / 4, -textObjects[i].textSize, textObjects[i].textSize * 3 / 4);

    fill(0, 255, 0, 100);
    textAlign(CENTER, BASELINE);
    textSize(textObjects[i].textSize);
    text(textObjects[i].preview, textObjects[i].posX, textObjects[i].posY);
  }
  if (selectedTextIndex !== -1) {
      background(0, 0, 0, 80);
    drawMailContent();
    drawMailInfos();
    drawQuitButton();
  }
}

function mousePressed() {
  if (mailContentVisible) {
    // Si le mail est visible, vérifier si le clic est sur le bouton "Quit"
    if (mouseX > quitButtonX && mouseX < quitButtonX + quitButtonWidth && mouseY > quitButtonY && mouseY < quitButtonY + quitButtonHeight) {
      // Effacer la div existante et réinitialisez l'index sélectionné
      textArea.remove();
      selectedTextIndex = -1;
      mailContentVisible = false;
    }
  } else {
    // Si le mail n'est pas visible, vérifier si le clic est sur une preview
    for (let i = 0; i < textObjects.length; i++) {
      let textLeft = textObjects[i].posX - textObjects[i].textWidth / 2;
      let textRight = textObjects[i].posX + textObjects[i].textWidth / 2;
      let textTop = textObjects[i].posY - textObjects[i].textSize * 3 / 4;
      let textBottom = textObjects[i].posY;

      if (mouseX > textLeft && mouseX < textRight && mouseY > textTop && mouseY < textBottom) {
        selectedTextIndex = i;
        mailContentVisible = true;

        // Créer une nouvelle div pour le contenu du mail
        textArea = createDiv('');
        textArea.style('overflow-y', 'scroll', 'hidden');
        textArea.style('max-height', '100%');
        textArea.style('padding', '5px');
        textArea.style('background-color', 'transparent');
        textArea.style('border', 'none');
        textArea.style('outline', 'none');
        textArea.style('resize', 'none');
        textArea.style('font-size', '16px');
        textArea.style('line-height', '1.5');
        textArea.style('font-family', 'Helvetica');
        textArea.style('color', '#000');

        // Metter à jour le contenu de la div avec le contenu du mail sélectionné
        textArea.html(tabContent[selectedTextIndex]);

        // Ajouter la div à la page
        textArea.position(20 + 10, 20 + 10); // Positionner la div à l'endroit désiré
        textArea.size(width / 2 - 20, height - 40 - 20); // Définir la taille de la div
        break; // Sortir de la boucle si une preview a été cliquée
      }
    }
  }
}
function drawMailContent() {
  let mailContent = tabContent[selectedTextIndex];
  let rectWidth = width / 2;
  let rectHeight = height - 40;
  let rectX = 20;
  let rectY = 20;

  fill(0, 255, 100, 200);
  rect(rectX, rectY, rectWidth, rectHeight);

  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);

  // Update the content of the text area
  textArea.html(mailContent);

  // Adjust the vertical position of the text based on scrolling
  textArea.position(rectX + 10, rectY + 10);
  textArea.size(rectWidth - 20, rectHeight - 20);
  textArea.style('margin-top', `-${mailContentScrollY}px`);
}

function drawMailInfos() {
  let mailSender = tabSender[selectedTextIndex];
  let mailRecipient = tabRecipient[selectedTextIndex];
  let mailSubject = tabSubject[selectedTextIndex];
  let mailDate = tabDate[selectedTextIndex];
  let rectWidth = width / 2 - 50;
  let rectHeight = height / 2;
  let rectX = rectWidth + 50 + 20 * 2;
  let rectY = rectHeight / 2;

  fill(0, 255, 100, 200);
  rect(rectX, rectY, rectWidth, rectHeight);

  fill(0);
  let textSizeVal = 16;
  textSize(textSizeVal);
  textAlign(LEFT, CENTER);
  text("Sender: " + mailSender + '\n' + '\n' + "Recipient: " + mailRecipient + '\n'+ '\n'  + "Subject: " + mailSubject + '\n'+ '\n'  + "Date: " + mailDate, rectX + 10, rectY + 10, rectWidth - 20, rectHeight - 20);
}

function drawQuitButton() {
  fill(color(200, 0, 0));
  rect(quitButtonX, quitButtonY, quitButtonWidth, quitButtonHeight);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Quit", quitButtonX + quitButtonWidth / 2, quitButtonY + quitButtonHeight / 2);
}

function mouseWheel(event) {
  if (selectedTextIndex !== -1) {
    // Check if the mouse is over the text
    let textLeft = textObjects[selectedTextIndex].posX - textObjects[selectedTextIndex].textWidth / 2;
    let textRight = textObjects[selectedTextIndex].posX + textObjects[selectedTextIndex].textWidth / 2;
    let textTop = textObjects[selectedTextIndex].posY - textObjects[selectedTextIndex].textSize * 3 / 4;
    let textBottom = textObjects[selectedTextIndex].posY;

    if (mouseX > textLeft && mouseX < textRight && mouseY > textTop && mouseY < textBottom) {
      // Calculate the maximum scroll position based on the content height
      let maxScroll = textArea.elt.scrollHeight - textArea.elt.clientHeight;

      // Update the vertical position of the text based on mouse wheel movement
      mailContentScrollY += event.delta;

      // Ensure the scroll position stays within bounds
      mailContentScrollY = constrain(mailContentScrollY, 0, maxScroll);

      // Prevent the default behavior to avoid page scrolling
      event.preventDefault();
    }
  }
}
