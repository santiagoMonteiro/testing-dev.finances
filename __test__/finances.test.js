const { By, Builder, until } = require('selenium-webdriver')
require('chromedriver')

describe('dev.finance$ - Test Suite', () => {
  let driver,
    createTransactionButton,
    modalOverlay,
    cancelTransactionCreationButton,
    submitButton,
    descriptionInput,
    amountInput,
    dateInput

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

    descriptionInput = await driver.findElement(By.id('description'))

    amountInput = await driver.findElement(By.id('amount'))

    dateInput = await driver.findElement(By.id('date'))
  }, 100000)

  afterEach(async () => {
    await driver.quit()
  })

  test.skip('CT01 - O usuário inicia o fluxo de criação de uma transação, mas cancela a operação', async () => {
    let modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')

    createTransactionButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses.includes('active')).toBe(true)

    cancelTransactionCreationButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')
  })

  test.skip('CT02 - Usuário tenta criar transação passando os campos vazios', async () => {
    createTransactionButton.click()

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT03 - Usuário tenta criar transação passando apenas o campo de descrição preenchido', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT04 - Usuário tenta criar transação passando apenas o campo de valor preenchido', async () => {
    createTransactionButton.click()

    await amountInput.sendKeys('256')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT05 - Usuário tenta criar transação passando apenas o campo de data preenchido', async () => {
    createTransactionButton.click()

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT06 - Usuário tenta criar transação passando apenas o campo de descrição e o campo de valor preenchidos', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT07 - Usuário tenta criar transação passando apenas o campo de descrição e o campo de data preenchidos', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT08 - Usuário tenta criar transação passando apenas o campo de valor e o campo de data preenchidos', async () => {
    createTransactionButton.click()

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test.skip('CT11-01 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: Dia válido, mas não para aquele mês.', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('00/00/0000')

    cancelTransactionCreationButton.click() // para remover o foco do input

    const dateInputText = await dateInput.getAttribute('value')

    expect(dateInputText).toBe('0001-01-01')
  })

  test.skip('CT11-02 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: Dia válido, mas não para aquele mês.', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('32/13/2023')

    cancelTransactionCreationButton.click() // para remover o foco do input

    const dateInputText = await dateInput.getAttribute('value')

    expect(dateInputText).toBe('2023-12-31')
  })

  test.skip('CT12 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: Dia válido, mas não para aquele mês.', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('31/09/2023')

    submitButton.click()

    const errorMessage = await dateInput.getAttribute('validationMessage')

    expect(errorMessage).toBe(
      'Insira um valor válido. O campo está incompleto ou tem uma data inválida.'
    )
  })
})
