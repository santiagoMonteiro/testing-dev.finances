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

  test('CT01 - O usuário inicia o fluxo de criação de uma transação, mas cancela a operação', async () => {
    let modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')

    createTransactionButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses.includes('active')).toBe(true)

    cancelTransactionCreationButton.click()

    modalOverlayClasses = await modalOverlay.getAttribute('class')

    expect(modalOverlayClasses).toBe('modal-overlay')
  })

  test('CT02 - Usuário tenta criar transação passando os campos vazios', async () => {
    createTransactionButton.click()

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT03 - Usuário tenta criar transação passando apenas o campo de descrição preenchido', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT04 - Usuário tenta criar transação passando apenas o campo de valor preenchido', async () => {
    createTransactionButton.click()

    await amountInput.sendKeys('256')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT05 - Usuário tenta criar transação passando apenas o campo de data preenchido', async () => {
    createTransactionButton.click()

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT06 - Usuário tenta criar transação passando apenas o campo de descrição e o campo de valor preenchidos', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT07 - Usuário tenta criar transação passando apenas o campo de descrição e o campo de data preenchidos', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT08 - Usuário tenta criar transação passando apenas o campo de valor e o campo de data preenchidos', async () => {
    createTransactionButton.click()

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Por favor, preencha todos os campos')
  })

  test('CT09 - Usuário tenta criar transação passando todos os campos preenchidos', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('-256')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    const transaction = await driver.findElement(By.tagName('tbody')).getText()

    expect(transaction).toBe("Conta de Luz -R$ 256,00 20/08/2001")
  })

  test('CT10 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de valor preenchido com 0', async () => {
    // Este teste irá falhar, pois a aplicação não apresenta a tratativa para o campo de valor definido como 0

    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('0')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    await driver.wait(until.alertIsPresent())

    const alert = await driver.switchTo().alert()

    const alertText = await alert.getText()

    expect(alertText).toBe('Digite um número maior que 0 para o valor da transação')
  })

  test('CT11-01 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: underflow ou overflow de dia/mês', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('00/00/0000')

    cancelTransactionCreationButton.click() // para remover o foco do input

    const dateInputText = await dateInput.getAttribute('value')

    expect(dateInputText).toBe('0001-01-01')
  })

  test('CT11-02 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: underflow ou overflow de dia/mês', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('256')

    await dateInput.sendKeys('32/13/2023')

    cancelTransactionCreationButton.click() // para remover o foco do input

    const dateInputText = await dateInput.getAttribute('value')

    expect(dateInputText).toBe('2023-12-31')
  })

  test('CT12 - Usuário tenta criar transação passando todos os campos preenchidos, mas o campo de data preenchido com uma data fictícia: Dia válido, mas não para aquele mês.', async () => {
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

  test('CT13 - Sistema realiza o cálculo do total de transações de entrada', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Freela de Landing Page')

    await amountInput.sendKeys('256,99')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()



    createTransactionButton.click()

    await descriptionInput.sendKeys('Freela de Aplicativo')

    await amountInput.sendKeys('123,01')

    await dateInput.sendKeys('21/08/2023')

    submitButton.click()

    const incomeDisplay = await driver.findElement(By.id('incomeDisplay')).getText()

    expect(incomeDisplay).toBe('R$ 380,00')
  })

  test('CT14 - Sistema realiza o cálculo do total de transações de saída', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Churrasco')

    await amountInput.sendKeys('-258,99')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()



    createTransactionButton.click()

    await descriptionInput.sendKeys('Jaqueta Jeans')

    await amountInput.sendKeys('-123,07')

    await dateInput.sendKeys('21/08/2023')

    submitButton.click()

    const expenseDisplay = await driver.findElement(By.id('expenseDisplay')).getText()

    expect(expenseDisplay).toBe('-R$ 382,06')
  })

  test('CT15 - Sistema realiza o cálculo do total de transações', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Churrasco')

    await amountInput.sendKeys('-258,99')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()



    createTransactionButton.click()

    await descriptionInput.sendKeys('Freela de website')

    await amountInput.sendKeys('123,07')

    await dateInput.sendKeys('21/08/2023')

    submitButton.click()

    const totalDisplay = await driver.findElement(By.id('totalDisplay')).getText()

    expect(totalDisplay).toBe('-R$ 135,92')
  })

  test('CT16-01 - Sistema realiza a formatação brasileira dos valores das transações', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Freela de Backend')

    await amountInput.sendKeys('1000')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()

    const incomeDisplay = await driver.findElement(By.id('incomeDisplay')).getText()

    expect(incomeDisplay).toBe('R$ 1.000,00')
  })

  test('CT16-02 - Sistema realiza a formatação brasileira dos valores das transações', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Aluguel')

    await amountInput.sendKeys('-1000')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()

    const expenseDisplay = await driver.findElement(By.id('expenseDisplay')).getText()

    expect(expenseDisplay).toBe('-R$ 1.000,00')
  })

  test('CT16-03 - Sistema realiza a formatação brasileira dos valores das transações', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Rendimento anual da Bolsa')

    await amountInput.sendKeys('1000000')

    await dateInput.sendKeys('20/08/2023')

    submitButton.click()

    const incomeDisplay = await driver.findElement(By.id('incomeDisplay')).getText()

    expect(incomeDisplay).toBe('R$ 1.000.000,00')
  })

  test('CT17 - Usuário exclui uma transação', async () => {
    createTransactionButton.click()

    await descriptionInput.sendKeys('Conta de Luz')

    await amountInput.sendKeys('-256')

    await dateInput.sendKeys('20/08/2001')

    submitButton.click()

    let transaction = await driver.findElement(By.tagName('tbody')).getText()

    expect(transaction).toBe("Conta de Luz -R$ 256,00 20/08/2001")


    const deleteButton = await driver.findElement(By.className('button-remove'))

    await driver.executeScript('arguments[0].click()', deleteButton)

    transaction = await driver.findElement(By.tagName('tbody')).getText()

    expect(transaction).toBe('')
  })
})
