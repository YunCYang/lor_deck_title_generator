import React, { useState, useEffect, useRef, ReactElement } from 'react';
import '../styles/Content.css';

import { HelpModal } from './modals/HelpModal';
import { SpriteModal } from './modals/SpriteModal';
import { renderDeckName } from '../utils/renderDeckName';

export const Content: React.FunctionComponent = () => {
  const [textInput, setTextInput] = useState('');
  const [selectionRange, setSelectionRange] = useState([0, 0]);
  const [tagType, setTagType] = useState('');
  const [selectColor, setSelectColor] = useState('#F5D765');
  const [selectGradient, setSelectGradient] = useState(['#F5D765', '#F5D765']);
  const [isModalShown, setIsModalShown] = useState<boolean | null>(null);
  const [isGradientShown, setIsGradientShown] = useState<boolean | null>(null);
  const [modalType, setModalType] = useState(0);
  const [isCopyDeck, setIsCopyDeck] = useState<boolean | null>(null);
  const [isOverCharLimit, setisOverCharLimit] = useState<boolean | null>(null);
  const [selectSprite, setSelectSprite] = useState('');
  const [isColorShown, setIsColorShown] = useState<boolean | null>(null);

  const textRef = useRef<HTMLTextAreaElement>();
  const modalRef = useRef<HTMLInputElement>();
  const gradientRef = useRef<HTMLInputElement>();
  const colorRef = useRef<HTMLInputElement>();
  const deckNameRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onBodyClick = (event: MouseEvent): void => {
      if (isModalShown === null || (modalRef.current && (modalRef.current.contains(event.target as HTMLElement)  ||
        event.target === document.getElementById('helpBtn')))) {
        return;
      }
      setIsModalShown(false);
    };
    document.body.addEventListener("click", (e): void => onBodyClick(e), { capture: true });

    return (): void => {
      document.body.removeEventListener("click", onBodyClick, { capture: true })
    };
  }, [isModalShown]);

  useEffect(() => {
    const onBodyGradientClick = (event: MouseEvent): void => {
      if (isGradientShown === null || (gradientRef.current && (gradientRef.current.contains(event.target as HTMLElement)))) {
        return;
      }
      setIsGradientShown(false);
    };
    document.body.addEventListener("click", (e): void => onBodyGradientClick(e), { capture: true });

    return (): void => {
      document.body.removeEventListener("click", onBodyGradientClick, { capture: true })
    };
  }, [isGradientShown]);

  useEffect(() => {
    const onBodyColorClick = (event: MouseEvent): void => {
      if (isColorShown === null || (colorRef.current && (colorRef.current.contains(event.target as HTMLElement)))) {
        return;
      }
      setIsColorShown(false);
    };
    document.body.addEventListener("click", (e): void => onBodyColorClick(e), { capture: true });

    return (): void => {
      document.body.removeEventListener("click", onBodyColorClick, { capture: true })
    };
  }, [isColorShown]);

  useEffect(() => {
    if (isCopyDeck) {
      const showCopyStatus = setTimeout(
        (): void => setIsCopyDeck(null), 3000
      );

      return () => clearTimeout(showCopyStatus);
    }
  }, [isCopyDeck]);

  useEffect(() => {
    const element = document.getElementById('deckNameInput') as HTMLInputElement;
    element.focus();
    element.selectionStart = selectionRange[0] + tagType.length + 2;
    element.selectionEnd = selectionRange[0] + tagType.length + 2;
  }, [tagType]);

  useEffect(() => {
    if (selectSprite) {
      addSpriteTag();
    }
  }, [selectSprite]);

  const showModal = (type: number): void => {
    setIsModalShown(!isModalShown);
    setModalType(type);
  };

  useEffect(() => {
    const warningTime = setTimeout(() => setisOverCharLimit(false), 3000);

    return (
      () => clearTimeout(warningTime)
    );
  }, [isOverCharLimit]);

  const renderModal = (): ReactElement => {
    if (modalType) {
      switch(modalType) {
        case 1:
          return <SpriteModal setSelectSprite={setSelectSprite} />;
        case 2:
          return <HelpModal />;
        default:
          return <></>;
      }
    }
    return <></>;
  };

  const addHtmlTag = (tagType: string): void => {
    const moddedText = textInput.substring(0, selectionRange[0])
      + `<${tagType}>` + textInput.substring(selectionRange[0], selectionRange[1])
      + `</${tagType}>` + textInput.substring(selectionRange[1], textInput.length);

      if (moddedText.length > 50) {
        setisOverCharLimit(true);
      } else {
        setTextInput(moddedText);
        setTagType(tagType);
      }
  };

  const addColorTag = (colorType: string): void => {
    const moddedText = textInput.substring(0, selectionRange[0])
      + `<${colorType}>` + textInput.substring(selectionRange[0], selectionRange[1])
      + `</color>` + textInput.substring(selectionRange[1], textInput.length);

    if (moddedText.length > 50) {
      setisOverCharLimit(true);
    } else {
      setTextInput(moddedText);
      // setSelectColor(colorType);
    }
  };

  const addGradientTags = (): void => {
    const gradientValueArr = [];
    let gradientText = '';
    for (let i = 0; i < selectionRange[1] - selectionRange[0]; i++) {
      gradientValueArr.push(
        renderGradient(
          selectionRange[1] - selectionRange[0],
          i,
          selectGradient[0],
          selectGradient[1]
        )
      );
    }
    for (let i = 0; i < selectionRange[1] - selectionRange[0]; i++) {
      gradientText += `<#${gradientValueArr[i]}>`;
      gradientText += textInput.substring(selectionRange[0] + i, selectionRange[0] + i + 1);
      if (i === selectionRange[1] - selectionRange[0] - 1) {
        gradientText += `</color>`;
      }
    }
    const moddedText = textInput.substring(0, selectionRange[0])
      + gradientText + textInput.substring(selectionRange[1], textInput.length);

    if (moddedText.length > 50) {
      setisOverCharLimit(true);
    } else {
      setTextInput(moddedText);
    }
  };

  const addSpriteTag = (): void => {
    const moddedText = textInput.substring(0, selectionRange[0])
      + `<sprite=${selectSprite}>` + textInput.substring(selectionRange[0], textInput.length);

    if (moddedText.length > 50) {
      setisOverCharLimit(true);
    } else {
      setTextInput(moddedText);
    }
  };

  const convertHexStringToNumber = (numChar: string): number => {
    if (isNaN(parseInt(numChar))) {
        switch(numChar) {
          case 'a':
          case 'A':
            return 10;
          case 'b':
          case 'B':
            return 11;
          case 'c':
          case 'C':
            return 12;
          case 'd':
          case 'D':
            return 13;
          case 'e':
          case 'E':
            return 14;
          case 'f':
          case 'F':
            return 15;
          default:
            return 0;
        }
      }
      return parseInt(numChar);
  };

  const renderGradient = (length: number, pos: number, start: string, end: string): string => {
    const result = [];
    const startArr = start.split('');
    const endArr = end.split('');
    const startNumArr = startArr.map((numChar: string): number => convertHexStringToNumber(numChar));
    const endNumArr = endArr.map((numChar: string): number => convertHexStringToNumber(numChar));
    if (length) {
      for (let i = 0; i < length - 1; i++) {
        const calculatedValue =
          Math.round((startNumArr[i + 1] * (length - pos - 1) / (length - 1)) +
          (endNumArr[i + 1] * pos / (length - 1)));
        let temp = '';
        if (calculatedValue <= 9) {
          temp = calculatedValue.toString();
        } else {
          switch (calculatedValue) {
            case 10:
              temp = 'a';
              break;
            case 11:
              temp = 'b';
              break;
            case 12:
              temp = 'c';
              break;
            case 13:
              temp = 'd';
              break;
            case 14:
              temp = 'e';
              break;
            case 15:
              temp = 'f';
              break;
            default:
              temp = '';
          }
        }
        result.push(temp);
      }
    }
    return result.join('');
  };



  const copyDeckName = (deckName: string): void => {
    navigator.clipboard.writeText(deckName).then(
      (): void => setIsCopyDeck(true),
      (): void => setIsCopyDeck(false)
    );
  };

  const showCopyStatus = (): ReactElement => {
    if (isCopyDeck !== null) {
      return isCopyDeck ?
        ( <span className='success'>Copied Successfully!</span> )
        : ( <span className='failure'>Failed to copy</span> );
    }
    return <></>;
  };

  return (
    <div className='content' >
      <div className='content_wrapper'>
          <textarea
            name="deckNameInput" id="deckNameInput"
            cols={30} rows={10} maxLength={50}
            placeholder="Enter your deck name here"
            onChange={
              (e): void => setTextInput(e.target.value)
            }
            value={textInput} onSelect={
              (e): void => setSelectionRange([e.currentTarget.selectionStart, e.currentTarget.selectionEnd])
            } ref={textRef as React.RefObject<HTMLTextAreaElement>}
          ></textarea>
          <div className={`warning_container ${
            isOverCharLimit ? 'warning_show'
            : isOverCharLimit !== null ? 'warning_hide'
            : ''
          }`}>
            Over 50 characters limit!
          </div>
        <div className='buttons_container'>
          <div className='text_buttons_container'>
            <button className='bold' onClick={(): void => addHtmlTag("b")}>B</button>
            <button className='italic' onClick={(): void => addHtmlTag("i")}>I</button>
            <button className='underline' onClick={(): void => addHtmlTag("u")}>U</button>
            <button className='strike' onClick={(): void => addHtmlTag("s")}>S</button>
            <button className='sup' onClick={(): void => addHtmlTag("sup")}>X<sup>2</sup></button>
            <button className='sub' onClick={(): void => addHtmlTag("sub")}>X<sub>2</sub></button>
            <button className='marked' onClick={(): void => addHtmlTag("mark")}><mark>M</mark></button>
          </div>
          <div className='scg_button_container'>
            <button className='sprite' onClick={ (): void => showModal(1) }>Sprite</button>
            <div className='color_container'>
              <button className='color' style={ { "color": selectColor } }
                onClick={(): void => setIsColorShown(true)}
                >Color</button>
              <div className={
                  `colorModal ${
                    isColorShown ? 'colorShow' :
                      isColorShown === false ? 'colorHide' : 'colorNull'
                  }`
                }
                ref={colorRef as React.RefObject<HTMLDivElement>}
              >
                <div className='color_selector_wrapper'>
                  <div className='color_input_wrapper'>
                    <input type="color" name="colorInput" id="colorInput"
                      onBlur={(e): void => { setSelectColor(e.target.value)}}
                      defaultValue={selectColor}
                    />
                  </div>
                </div>
                <div className='color_action_wrapper'>
                  <button onClick={
                    (): void => {
                      addColorTag(selectColor);
                      setIsColorShown(false);
                    }
                  }>Confirm</button>
                </div>
              </div>
            </div>
            <div className='gradient_container'>
              <button className='gradient' id="gradientBtn"
                onClick={ (): void => setIsGradientShown(true) }>
                <span style={{"color": `#${renderGradient(8, 0, selectGradient[0], selectGradient[1])}`}}>G</span>
                <span style={{"color": `#${renderGradient(8, 1, selectGradient[0], selectGradient[1])}`}}>r</span>
                <span style={{"color": `#${renderGradient(8, 2, selectGradient[0], selectGradient[1])}`}}>a</span>
                <span style={{"color": `#${renderGradient(8, 3, selectGradient[0], selectGradient[1])}`}}>d</span>
                <span style={{"color": `#${renderGradient(8, 4, selectGradient[0], selectGradient[1])}`}}>i</span>
                <span style={{"color": `#${renderGradient(8, 5, selectGradient[0], selectGradient[1])}`}}>e</span>
                <span style={{"color": `#${renderGradient(8, 6, selectGradient[0], selectGradient[1])}`}}>n</span>
                <span style={{"color": `#${renderGradient(8, 7, selectGradient[0], selectGradient[1])}`}}>t</span>
              </button>
              <div className={
                  `gradientModal ${
                    isGradientShown ? 'gradientShow' :
                      isGradientShown === false ? 'gradientHide' : 'gradientNull'
                  }`
                }
                ref={gradientRef as React.RefObject<HTMLDivElement>}
              >
                <div className='gradient_selector_wrapper'>
                  <div className='gradient_start_wrapper'>
                    <input type="color" name="gradientStart" id="gradientStart"
                      onBlur={(e): void => {
                        const temp = [e.target.value, selectGradient[1]];
                        setSelectGradient(temp);
                      }} defaultValue={selectGradient[0]}
                    />
                    <label htmlFor="gradientStart">Start</label>
                  </div>
                  <div className='gradient_end_wrapper'>
                    <input type="color" name="gradientEnd" id="gradientEnd"
                      onBlur={(e): void => {
                        const temp = [selectGradient[0], e.target.value];
                        setSelectGradient(temp);
                      }} defaultValue={selectGradient[1]}
                    />
                    <label htmlFor="gradientEnd">End</label>
                  </div>
                </div>
                <div className='gradient_action_wrapper'>
                  <button onClick={
                    (): void => {
                      addGradientTags();
                      setIsGradientShown(false);
                    }
                  }>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='text_container' id="text_container">
          {/* <img
            src={require('../images/corner.png')} alt="border corner"
            className='corner_c c1'
          />
          <img
            src={require('../images/corner.png')} alt="border corner"
            className='corner_c c2'
          />
          <img
            src={require('../images/corner.png')} alt="border corner"
            className='corner_c c3'
          />
          <img
            src={require('../images/corner.png')} alt="border corner"
            className='corner_c c4'
          /> */}
          { renderDeckName(textInput, deckNameRef) }
        </div>
        <div className='actions_container'>
          <div className='copyBtn_container'>
            <button className='copy'
              onClick={(): void => copyDeckName(textInput)}>Copy</button>
            {showCopyStatus()}
          </div>
          <button className='help' id='helpBtn'
            onClick={ (): void => {
              if (modalType !== 2 && isModalShown) {
                setModalType(2);
                return;
              }
              showModal(2);
            } }
          >?</button>
        </div>
        <div className={
          `content_modal ${
            isModalShown ? 'modalShow' :
              isModalShown === false ? 'modalHide' : ''
          }`
        } ref={modalRef as React.RefObject<HTMLDivElement>}>
          {renderModal()}
        </div>
      </div>
    </div>
  );
};
