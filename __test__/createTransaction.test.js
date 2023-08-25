const { By, Key, Builder, Alert } = require('selenium-webdriver')
require('chromedriver')

// const driver = new Builder().forBrowser('chrome').build()

describe('Criação de transações - Test Suite', () => {
  let driver, createTransactionButton, modalOverlay, cancelTransactionCreationButton, submitButton

  beforeEach(async () => {
    driver = new Builder().forBrowser('chrome').build()

    await driver.get('https://santiagomonteiro.github.io/dev.finances/')
    

    createTransactionButton = await driver.findElement(
      By.id('createTransactionButton')
    )

    modalOverlay = await driver.findElement(By.id('modal-overlay'))

    cancelTransactionCreationButton = await driver.findElement(
      By.id('cancelTransactionCreationButton')
    )

    submitButton = await driver.findElement(By.id('submit-button'))
  })

  afterEach(async () => {
    await driver.quit()
  })

  test('O usuário inicia o fluxo de criação de uma transação, mas cancela a operação', async () => {
    let modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')

    createTransactionButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses.includes('active')).toBe(true)
  })


  test('Usuário tenta criar transação passando os campos vazios', async () => {
    // await driver.executeScript(
    //   'window.originalAlert = window.alert; window.alert = function(message) { window.alertMessage = message; };'
    // );

    createTransactionButton.click()
    submitButton.click()

    // const message = driver.switchTo().alert().getText();

    const alert = await driver.switchTo().alert();

    // Obtém o texto do alert
    const texto = await alert.getText();

    // const alertMessage = await driver.executeScript("return window.alertMessage;");
    console.log(message)
  })
})


// const windowAlert = window.alert;

// window.alert = function(message) {
//   console.log(`window.alert called with message: ${message}`);
//   return windowAlert(message);
// };
// alert('FOO');