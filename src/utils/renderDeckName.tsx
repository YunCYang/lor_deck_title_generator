import React, { ReactElement } from "react";
import { spriteList } from '../components/modals/spriteList';
import '../styles/sprite.css';

interface StyleType {
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  position: string;
  top: string;
  backgroundColor: string;
  color: string;
}

interface RecordType {
  id: number;
  text: string;
  style: StyleType;
  isShown: Boolean;
  className: string;
}

export const renderDeckName = (textInput: string, deckNameRef: React.RefObject<(HTMLDivElement | null)[]>): ReactElement[] | null => {
  const dataRecord = [] as RecordType[];
  const addDiv = (text: string): ReactElement[] | null => {
    if (text.length) {
      const textElement = text.split('')
        .map((char: string, index: number): ReactElement => {
          return (
            <div
              key={`text_${index}`}
              ref={el => {
                if (deckNameRef.current) {
                  deckNameRef.current[index] = el;
                }
              }}
              >{char}</div>
          );
        });
      return textElement;
    }
    return null;
  };
  const processRecord = (index: number, isShown: boolean, style?: string, data?: string): void => {
    if (!dataRecord[index]) {
      if (isShown) {
        dataRecord[index] = {
          id: index,
          text: textInput[index],
          isShown: true,
          className: 'display_text',
          style: {
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            position: 'relative',
            top: '0',
            backgroundColor: 'none',
            color: '#282428'
          }
        };
        if (style && data) {
          dataRecord[index]['style'][style as keyof StyleType] = data;
        }
      } else {
        dataRecord[index] = {
          id: index,
          text: textInput[index],
          isShown: false,
          className: dataRecord[index]['className'],
          style: {
            fontWeight: '400',
            fontStyle: 'normal',
            textDecoration: 'none',
            position: 'relative',
            top: '0',
            backgroundColor: 'none',
            color: '#282428'
          }
        };
      }
    } else {
      if (isShown) {
        if (style && data) {
          dataRecord[index]['style'][style as keyof StyleType] = data;
        }
      } else {
        dataRecord[index]['isShown'] = false;
      }
    }
  };

  const processHtml = (arr: ReactElement[] | null): void => {
    const textStyles = ['b', 'i', 'u', 's', 'sup', 'sub', 'mark'];
    if (arr) {
      textStyles.map((style: string): void => {
        let inStyle = false;
        let tagMatch = false;
        let inTag = false;
        for (let i = 0; i < arr.length; i++) {
          if (inStyle) {
            if (inTag || tagMatch) {
              if (arr[i].props.children === '>') {
                if ((inTag && tagMatch) || tagMatch) {
                  inStyle = false;
                  tagMatch = false;
                  inTag = false;
                } else if (inTag) {
                  inStyle = true;
                  inTag = false;
                }
              }
              processRecord(i, false);
            } else {
              if (arr.length >= style.length * 2 + 5 &&
                arr.length - i >= 4) {
                if (arr[i].props.children === '<' &&
                  arr[i + 1].props.children === '/') {
                  if (arr.length - i >= 7) {
                    if (arr[i + 2].props.children === 'm' &&
                      arr[i + 3].props.children === 'a' &&
                      arr[i + 4].props.children === 'r' &&
                      arr[i + 5].props.children === 'k' &&
                      arr[i + 6].props.children === '>')
                    {
                      let sameStyle = true;
                      for (let j = 0; j < style.length; j++) {
                        if (arr[i + 2 + j].props.children !== style[j]) {
                          sameStyle = false;
                        }
                      }
                      if (sameStyle) {
                        tagMatch = true;
                        processRecord(i, false);
                        continue;
                      }
                    }
                  }
                  if (arr.length - i >= 6) {
                    if (arr[i + 2].props.children === 's' &&
                      arr[i + 3].props.children === 'u' &&
                      (arr[i + 4].props.children === 'p' ||
                      arr[i + 4].props.children === 'b') &&
                      arr[i + 5].props.children === '>')
                    {
                      let sameStyle = true;
                      for (let j = 0; j < style.length; j++) {
                        if (arr[i + 2 + j].props.children !== style[j]) {
                          sameStyle = false;
                        }
                      }
                      if (sameStyle) {
                        tagMatch = true;
                        processRecord(i, false);
                        continue;
                      }
                    }
                  }
                  if (((arr[i + 2].props.children === 'b' ||
                      arr[i + 2].props.children === 'i' ||
                      arr[i + 2].props.children === 'u' ||
                      arr[i + 2].props.children === 's') &&
                      arr[i + 3].props.children === '>'))
                  {
                    let sameStyle = true;
                    for (let j = 0; j < style.length; j++) {
                      if (arr[i + 2 + j].props.children !== style[j]) {
                        sameStyle = false;
                      }
                    }
                    if (sameStyle) {
                      tagMatch = true;
                      processRecord(i, false);
                      continue;
                    }
                  }
                }
              }
              let currentStyle = '';
              let currentValue = '';
              switch (style) {
                case 'b':
                  currentStyle = 'fontWeight';
                  currentValue = '700';
                  break;
                case 'i':
                  currentStyle = 'fontStyle';
                  currentValue = 'italic';
                  break;
                case 'u':
                  currentStyle = 'textDecoration';
                  currentValue = 'underline';
                  break;
                case 's':
                  currentStyle = 'textDecoration';
                  currentValue = 'line-through';
                  break;
                case 'sup':
                  currentStyle = 'top';
                  currentValue = '-8%';
                  break;
                case 'sub':
                  currentStyle = 'top';
                  currentValue = '8%';
                  break;
                case 'mark':
                  currentStyle = 'backgroundColor';
                  currentValue = 'yellow';
                  break;
                default:
                  break;
              }
              if (currentStyle && currentValue) {
                processRecord(i, true, currentStyle, currentValue);
              }
            }
          } else {
            if (arr.length - i >= style.length  + 2 &&
              arr[i].props.children === '<') {
              if ((arr.length - i >= 5 &&
                arr[i + 1].props.children === 's' &&
                arr[i + 2].props.children === 'u' &&
                (arr[i + 3].props.children === 'p' ||
                arr[i + 3].props.children === 'b') &&
                arr[i + 4].props.children === '>') ||
                (arr.length - i >= 6 &&
                arr[i + 1].props.children === 'm' &&
                arr[i + 2].props.children === 'a' &&
                arr[i + 3].props.children === 'r' &&
                arr[i + 4].props.children === 'k' &&
                arr[i + 5].props.children === '>') ||
                ((arr[i + 1].props.children === 'b' ||
                arr[i + 1].props.children === 'i' ||
                arr[i + 1].props.children === 'u' ||
                arr[i + 1].props.children === 's') &&
                arr[i + 2].props.children === '>')) {
                let sameStyle = true;
                for (let j = 0; j < Math.min(style.length, arr.length - i - 1); j++) {
                  if (arr[i + 1 + j].props.children !== style[j]) {
                    sameStyle = false;
                  }
                }
                if (arr[i + 1 + style.length].props.children !== '>') {
                  sameStyle = false;
                }
                if (sameStyle) {
                  inTag = true;
                  inStyle = true;
                  processRecord(i, false);
                  continue;
                }
              }
            }
            processRecord(i, true);
          }
        }
      });
    }
  };
  const formatColor = (origin: string): string => {
    const addNotation = '0x' + origin;
    if (!isNaN(parseInt(addNotation))) {
      if (origin.length === 3) {
        return origin[0] + origin[0] + origin[1]
          + origin[1] + origin[2] + origin[2];
      } else if (origin.length === 6 ||
        origin.length === 8) {
        return origin;
      }
    }
    return origin;
  };
  const convertColor = (origin: string): string => {
    const addNotation = '0x' + origin;
    if (!isNaN(parseInt(addNotation))) {
      const colorStringArr = origin.match(/.{1,2}/g);
      let colorNumArr = [0];
      if (colorStringArr) {
        colorNumArr = colorStringArr.map((colorString: string): number => {
          return parseInt(`0x${colorString}`);
        });
      }
      if (colorNumArr.length === 4) {
        const opacity = colorNumArr[3] / 255;
        colorNumArr[3] = parseFloat(opacity.toFixed(2));
        return `rgba(${colorNumArr[0]}, ${colorNumArr[1]},
          ${colorNumArr[2]}, ${colorNumArr[3]})`;
      }
      return `rgba(${colorNumArr[0]}, ${colorNumArr[1]},
          ${colorNumArr[2]}`;
    } else {
      switch (origin.toLowerCase()) {
        case 'red':
          return 'rgb(255, 0, 0)';
        case 'orange':
          return 'rgb(255, 165, 0)';
        case 'yellow':
          return 'rgb(255, 255, 0)';
        case 'green':
          return 'rgb(0, 128, 0)';
        case 'blue':
          return 'rgb(0, 0, 255)';
        case 'purple':
          return 'rgb(128, 0, 128)';
        case 'black':
          return 'rgb(0, 0, 0)';
        case 'white':
          return 'rgb(255, 255, 255)';
        default:
          return 'rgb(0, 0, 0)';
      }
    }
  };
  const processColor = (arr: ReactElement[] | null): void => {
    let currentColor = 'rgb(0, 0, 0)';

    if (arr) {
      let inTag = false;
      for (let i = 0; i < arr.length; i++) {
        if (inTag) {
          if (arr[i].props.children === '>') {
            inTag = false;
          }
          processRecord(i, false);
        } else {
          if (arr.length - i >= 7 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === '#' &&
            arr[i + 5].props.children === '>')
          { // shorthand hex
            inTag = true;
            const colorCode = arr[i + 2].props.children
              + arr[i + 3].props.children
              + arr[i + 4].props.children;
            currentColor = convertColor(formatColor(colorCode));
            processRecord(i, false);
          } else if (arr.length - i >= 10 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === '#' &&
            arr[i + 8].props.children === '>')
          { // long hex
            inTag = true;
            const colorCode = arr[i + 2].props.children
              + arr[i + 3].props.children
              + arr[i + 4].props.children
              + arr[i + 5].props.children
              + arr[i + 6].props.children
              + arr[i + 7].props.children;
            currentColor = convertColor(formatColor(colorCode));
            processRecord(i, false);
          } else if (arr.length - i >= 12 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === '#' &&
            arr[i + 10].props.children === '>')
          { // rgba hex
            inTag = true;
            const colorCode = arr[i + 2].props.children
              + arr[i + 3].props.children
              + arr[i + 4].props.children
              + arr[i + 5].props.children
              + arr[i + 6].props.children
              + arr[i + 7].props.children
              + arr[i + 8].props.children
              + arr[i + 9].props.children;
            currentColor = convertColor(formatColor(colorCode));
            processRecord(i, false);
          } else if (arr.length - i >= 16 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === 'c' &&
            arr[i + 2].props.children === 'o' &&
            arr[i + 3].props.children === 'l' &&
            arr[i + 4].props.children === 'o' &&
            arr[i + 5].props.children === 'r' &&
            arr[i + 6].props.children === '=' &&
            arr[i + 7].props.children === '#' &&
            arr[i + 14].props.children === '>')
          { // color tag hex
            inTag = true;
            const colorCode = arr[i + 8].props.children
              + arr[i + 9].props.children
              + arr[i + 10].props.children
              + arr[i + 11].props.children
              + arr[i + 12].props.children
              + arr[i + 13].props.children;
            currentColor = convertColor(formatColor(colorCode));
            processRecord(i, false);
          } else if (arr.length - i >= 18 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === 'c' &&
            arr[i + 2].props.children === 'o' &&
            arr[i + 3].props.children === 'l' &&
            arr[i + 4].props.children === 'o' &&
            arr[i + 5].props.children === 'r' &&
            arr[i + 6].props.children === '=' &&
            arr[i + 7].props.children === '#' &&
            arr[i + 16].props.children === '>')
          { // color tag rgba hex
            inTag = true;
            const colorCode = arr[i + 8].props.children
              + arr[i + 9].props.children
              + arr[i + 10].props.children
              + arr[i + 11].props.children
              + arr[i + 12].props.children
              + arr[i + 13].props.children
              + arr[i + 14].props.children
              + arr[i + 15].props.children;
            currentColor = convertColor(formatColor(colorCode));
            processRecord(i, false);
          } else if (arr.length - i >= 13 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === 'c' &&
            arr[i + 2].props.children === 'o' &&
            arr[i + 3].props.children === 'l' &&
            arr[i + 4].props.children === 'o' &&
            arr[i + 5].props.children === 'r' &&
            arr[i + 6].props.children === '=' &&
            arr[i + 7].props.children === '#')
          { // color tag name
            if (arr[i + 8].props.children === 'r' &&
              arr[i + 9].props.children === 'e' &&
              arr[i + 10].props.children === 'd' &&
              arr[i + 11].props.children === '>')
            {
              inTag = true;
              currentColor = 'rgb(255, 0, 0)';
              processRecord(i, false);
            } else if (arr.length - i >= 14 &&
                arr[i + 12].props.children === '>') {
              const colorName = arr[i + 8].props.children
                + arr[i + 9].props.children
                + arr[i + 10].props.children
                + arr[i + 11].props.children;
              if (colorName === 'blue') {
                inTag = true;
                currentColor = 'rgb(0, 0, 255)';
                processRecord(i, false);
              }
            } else if (arr.length - i >= 15 &&
                    arr[i + 13].props.children === '>') {
              const colorName = arr[i + 8].props.children
                + arr[i + 9].props.children
                + arr[i + 10].props.children
                + arr[i + 11].props.children
                + arr[i + 12].props.children;
              if (colorName === 'green') {
                inTag = true;
                currentColor = 'rgb(0, 128, 0)';
                processRecord(i, false);
              } else if (colorName === 'white') {
                inTag = true;
                currentColor = 'rgb(255, 255, 255)';
                processRecord(i, false);
              } else if (colorName === 'black') {
                inTag = true;
                currentColor = 'rgb(0, 0, 0)';
                processRecord(i, false);
              }
            } else if (arr.length - i >= 16 &&
                    arr[i + 14].props.children === '>') {
              const colorName = arr[i + 8].props.children
                + arr[i + 9].props.children
                + arr[i + 10].props.children
                + arr[i + 11].props.children
                + arr[i + 12].props.children
                + arr[i + 13].props.children;
              if (colorName === 'orange') {
                inTag = true;
                currentColor = 'rgb(255, 165, 0)';
                processRecord(i, false);
              } else if (colorName === 'yellow') {
                inTag = true;
                currentColor = 'rgb(255, 255, 0)';
                processRecord(i, false);
              } else if (colorName === 'purple') {
                inTag = true;
                currentColor = 'rgb(128, 0, 128)';
                processRecord(i, false);
              }
            }
          } else if (arr.length - i >= 8 &&
            arr[i].props.children === '<' &&
            arr[i + 1].props.children === '/' &&
            arr[i + 2].props.children === 'c' &&
            arr[i + 3].props.children === 'o' &&
            arr[i + 4].props.children === 'l' &&
            arr[i + 5].props.children === 'o' &&
            arr[i + 6].props.children === 'r' &&
            arr[i + 7].props.children === '>')
          { // end color tag
            inTag = true;
            currentColor = 'rgb(0, 0, 0)';
            processRecord(i, false);
          } else { // usual color
            processRecord(i, true, 'color', currentColor);
          }
        }
      }
    }
  };
  const searchSpriteList = (input: string): string => {
    const sprite = spriteList.find(element => {
      if (!isNaN(parseInt(input)) &&
        parseInt(input).toString() === input) {
        return (element.id === parseInt(input));
      } else {
        return (element.name === input);
      }
    });
    if (sprite !== undefined) {
      return sprite.name;
    }
    return '';
  };
  const processSprite = (arr: ReactElement[] | null): void => {
    if (arr) {
      let inTag = false;
      for (let i = 0; i < arr.length; i++) {
        if (inTag) {
          if (arr[i].props.children === '>') {
            inTag = false;
          }
          processRecord(i, false);
        } else {
          if (arr.length - i >= 10) {
            if (arr[i].props.children === '<' &&
              arr[i + 1].props.children === 's' &&
              arr[i + 2].props.children === 'p' &&
              arr[i + 3].props.children === 'r' &&
              arr[i + 4].props.children === 'i' &&
              arr[i + 5].props.children === 't' &&
              arr[i + 6].props.children === 'e')
            {
              let tagEnd = 0;
              let equalStart = 0;
              for (let j = i; j < arr.length; j++) {
                if (arr[j].props.children === '=' &&
                  (j - i === 7 || j - i === 12)) {
                  equalStart = j;
                }
                if (arr[j].props.children === '>') {
                  if (equalStart) {
                    const elementInMiddle = arr.slice(equalStart + 1, j);
                    const textInMiddleArr = elementInMiddle.map(element => element.props.children);
                    const textInMiddle = textInMiddleArr.join('');
                    const regex = /^[_a-zA-Z0-9]+$/;
                    if (regex.test(textInMiddle)) {
                      tagEnd = j;
                      break;
                    }
                  }
                }
              }
              if (tagEnd && equalStart) {
                const spriteId = arr.slice(equalStart + 1, tagEnd);
                const spriteIdTextArr = spriteId.map(element => element.props.children);
                const spriteIdText = spriteIdTextArr.join('');
                const spriteClass = searchSpriteList(spriteIdText);
                if (spriteClass) {
                  inTag = true;
                  dataRecord[i]['className'] = `${dataRecord[i]['className']} sprite_display_${spriteClass} sprite_display sprite_${spriteClass}`;
                  processRecord(i, true, 'color', 'transparent');
                }
              }
            }
          }
          processRecord(i, true);
        }
      }
    }
  };
  const renderResult = (): ReactElement[] => {
    const resultArr = dataRecord.map((record: RecordType, index: number): ReactElement => {
        if (record.isShown) {
          return (
            <div
              key={`text_${record.text}_${index}`}
              ref={el => {
                if (deckNameRef.current) {
                  deckNameRef.current[index] = el;
                }
              }}
              className={record['className']}
              style={{
                fontWeight: record['style']['fontWeight'],
                fontStyle: record['style']['fontStyle'],
                textDecoration: record['style']['textDecoration'],
                position: record['style']['position'],
                top: record['style']['top'],
                backgroundColor: record['style']['backgroundColor'],
                color: record['style']['color']
              }}
              >{record.text}</div>
          );
        }
        return <></>;
      });
    return resultArr;
  };

  const processedInput = addDiv(textInput);
  processHtml(processedInput);
  processColor(processedInput);
  processSprite(processedInput);
  const processedText = renderResult();
  return processedText;
};
