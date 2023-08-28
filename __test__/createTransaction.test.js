const { By, Key, Builder, logging, until } = require('selenium-webdriver')
require('chromedriver')

describe('Criação de transações - Test Suite', () => {
  let driver,
    createTransactionButton,
    modalOverlay,
    cancelTransactionCreationButton,
    submitButton,
    descriptionInput,
    amountInput,
    dateInput

  beforeEach(async () => {
    driver = new Builder()
      .forBrowser('chrome')
      .build()

    await driver.get('https://santiagomonteiro.github.io/dev.finances/')

    createTransactionButton = await driver.findElement(
      By.id('createTransactionButton')
    )

    modalOverlay = await driver.findElement(By.id('modal-overlay'))

    cancelTransactionCreationButton = await driver.findElement(
      By.id('cancelTransactionCreationButton')
    )

    submitButton = await driver.findElement(By.id('submit-button'))

    descriptionInput = await driver.findElement(By.id('description'))

    amountInput = await driver.findElement(By.id('amount'))

    dateInput = await driver.findElement(By.id('date'))

  }, 10000)

  afterEach(async () => {
    await driver.quit()
  })

  test('O usuário inicia o fluxo de criação de uma transação, mas cancela a operação', async () => {
    let modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')

    createTransactionButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses.includes('active')).toBe(true)

    cancelTransactionCreationButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')
  })

  test('Usuário tenta criar transação passando os campos vazios', async () => {
    createTransactionButton.click()

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })
})
