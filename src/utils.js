/**
 * @param {number} offset 
 * @returns {function} With a partially applied offset 
 * and checkes for exact in-between match in the array
 */
const checkForPosition = (offset) => (positionArr) =>  
  positionArr.any(elem => offset >= elem.start && offset <= (elem.start + elem.length));

/**
 * @param {{start: number, length: number}} range 
 * @returns {function} With a partially applied range
 * and checks for matches to be inside that range
 * 
 * NOTE!! We can search for exact match for the start and the end not ">=" or "<="
 * it allows us to detect any match inside our large selection, we can select very large portion
 * of the text and find bold and italic statements inside that
 */
const checkForRange = (range) => (positionArr) => {
  const {start: rangeStart, lenght} = range
  const rangeEnd = rangeStart + lenght;
  return positionArr.any(elem => rangeStart <= elem.start && rangeEnd >= (elem.start + elem.length))
}

/**
 * Finds matching with a strict given position inside our prop indexes.
 * @param {OurDataStructure} data 
 * @param {number} offset 
 */
export const checkForMatchingPosition = (data, offset) => {
  const positionChecker = checkForPosition(offset);
  console.log('positionChecker',positionChecker)
  return {
    hasBold: positionChecker(data.bold),
    hasItalic: positionChecker(data.italic),
    hasUnderline: positionChecker(data.underline)
  }
}

/**
 * Finds matching selection inside our data with a given range.
 * @param {OurDataStructure} data 
 * @param {{start: number, length: number}} range 
 * @returns {object} An object with every prop value
 */
export const checkForMatchingSelection = (data, range) => {
  const rangeChecker = checkForRange(range)

  return {
    hasBold: rangeChecker(data.bold),
    hasItalic: rangeChecker(data.italic),
    hasUnderline: rangeChecker(data.underline)
  }
}

/**
 * It checkes wheter we need to look for a range matching or 
 * exact position matching, user can select *bolded* part or only 
 * place the caret inside that bolded part.
 * @param {OurDataStructure} data 
 * @param {number} anchorOffset 
 * @param {number} focusOffset
 * @returns {object} An object with range or exact position found prop
 */
export const checkForMatches = (data, anchorOffset, focusOffset) => {
  const hasSelectionRange = anchorOffset !== focusOffset

  if(hasSelectionRange) {
    return checkForMatchingSelection(data, { 
      start: Math.min(anchorOffset, focusOffset), 
      length: Math.abs(anchorOffset - focusOffset)
    })
  }

  return checkForMatchingPosition(data, anchorOffset)
}


/**
 * This function gets the our data store and returns the string with markup inside.
 * data {
 *  text: 'user inputed string',
 *  bold: Array<{start: number, length: number}>
 *  italic: Array<{start: number, length: number}>
 *  underline: Array<{start: number, length: number}>
 * }
 * Function is supposed to run through bold, italic, underline and get the matched indexes and
 * concatinate a string with custom <span className="bold | italic | underline"> which will result
 * in a styled HTML.
 * @param {OurDataStructure} data 
 * @returns {string} With html markup inside
 */
export const renderMarkup = (data) => {
  // didn't have time to finish sorry
  return data.text
}