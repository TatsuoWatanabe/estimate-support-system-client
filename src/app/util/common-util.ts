export class CommonUtil {

  /**
   * Update all text field to reinitialize all the Materialize labels on the page if dynamically adding inputs
   */
  public static updateTextFields() {
    try {
      [300, 600, 1200].forEach((ms) => {
        setTimeout(() => Materialize.updateTextFields(), ms);
      });
    } catch (e) {
      // maybe occur error in webpacked environment.
      console.warn(e.message);
    }
  }

  public static hoursFormat(num: any) {
    const floatNum = parseFloat(num);
    const exp      = isNaN(floatNum) ? 0 : floatNum;
    return exp.toFixed(2).replace(/(\d)0+$/, '$1');
  }

}
