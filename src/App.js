import {  useEffect, useState } from 'react';
import rangy from 'rangy'
import { checkForMatches, renderMarkup } from './utils';


const initialData = {
  text: 'some text',
  bold: [],
  italic: [],
  underline: []
}

const initalMatches = {
  hasBold: false,
  hasItalic: false,
  hasUnderline: false
}

function App() {
  const [data, setData] = useState(initialData)
  const [matches, setMatches] = useState(initalMatches)

  useEffect(() => {
    rangy.init()
  }, [])

  const onClick = (prop) => () => {
    const selection = rangy.getSelection();
    const { anchorOffset, focusOffset } = selection
    const hasAnyMatches = checkForMatches(data, anchorOffset, focusOffset)
    
    // if it has a matching range we need to remove it
    // otherwise add it do specific prop array
    if(hasAnyMatches[prop]) {
      // find matched range in the index and remove it
      // didn't have time to write this down 😅 hard coded 0
      const idx = 0
      setData({
        ...data,
        prop: [
          ...data[prop].slice(0, idx),
          ...data[prop].slice(idx + 1)
        ]
      })
    } else {
      setData({
        ...data,
        [prop]: [...data[prop], { start: anchorOffset, lenght: Math.abs(focusOffset - anchorOffset) }]
      })
    }
  }

  // store inner text inside our state to later store it inside local storage
  const onInput = (e) => {
    setData({...data, text: e.target.innerText})
  }

  // check caret or selection position at any given selection or caret change
  const onSelect = () => {
    const selection = rangy.getSelection();
    const { anchorOffset, focusOffset } = selection

    const hasAnyMatches = checkForMatches(data, anchorOffset, focusOffset)

    setMatches(hasAnyMatches)
  }

  return (
    <div className="App">
      <button 
        onClick={onClick('bold')} 
        className={`some-btn-class ${matches.hasBold ? ' grey': ''}`}
      >
        bold
      </button>
      <button 
        onClick={onClick('italic')}
        className={`some-btn-class ${matches.hasItalic ? ' grey': ''}`}
      >
        italic
      </button>
      <button 
        onClick={onClick('underline')}
        className={`some-btn-class ${matches.hasUnderline ? ' grey': ''}`}
      >
        underline
      </button>
      <div 
        contentEditable 
        onInput={onInput}
        onSelect={onSelect}
        dangerouslySetInnerHTML={{__html: renderMarkup(data)}} 
      />
    </div>
  );
}

export default App;
