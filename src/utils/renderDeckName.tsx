import React, { ReactElement, useRef } from "react";
// import ReactDom from 'react-dom';
import { deepCloneArray } from './deepCloneArray';

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
}

export const renderDeckName = (textInput: string, deckNameRef: React.RefObject<(HTMLDivElement | null)[]>): ReactElement[] | null => {
  const dataRecord = [] as RecordType[];
  // let resultArr = [];
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

  const processHtml = (arr: ReactElement[] | null): ReactElement[] | null => {
    const textStyles = ['b', 'i', 'u', 's', 'sup', 'sub', 'mark'];
    // const tempArr = arr !== null ? deepCloneArray(arr as any[]) : null ;
    if (arr) {
      textStyles.map((style: string): void => {
        let inStyle = false;
        let tagMatch = false;
        let inTag = false;
        for (let i = 0; i < arr.length; i++) {
          // inStyle => add style and append
          // tagMatch => end tag and inStyle only, don't append
          // inTag => head tag only, don't append
          // no tag => append without style
          //
          // check tag => check '<'
          // edit tag => append
          if (inStyle) {
            if (inTag || tagMatch) {
              if (arr[i].props.children === '>') {
                if ((inTag && tagMatch) || tagMatch) {
                  // end instyle, add to arr w/o style
                  inStyle = false;
                  tagMatch = false;
                  inTag = false;
                  console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
                  processRecord(i, false);
                } else if (inTag) {
                  // add instyle, add to arr w/ style
                  inStyle = true;
                  inTag = false;
                  console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
                  processRecord(i, false);
                  continue;
                }
              }
              console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
              processRecord(i, false);
              // skip arr
            } else {
              if (arr.length >= style.length * 2 + 5 &&
                arr[i].props.children === '<' &&
                arr[i + 1].props.children === '/') {
                if ((arr.length >= 11 && i < arr.length - 5 &&
                  arr[i + 2].props.children === 's' &&
                  arr[i + 3].props.children === 'u' &&
                  (arr[i + 4].props.children === 'p' ||
                  arr[i + 4].props.children === 'b') &&
                  arr[i + 5].props.children === '>') ||
                  (arr.length >= 12 && i < arr.length - 6 &&
                  arr[i + 2].props.children === 'm' &&
                  arr[i + 3].props.children === 'a' &&
                  arr[i + 4].props.children === 'r' &&
                  arr[i + 5].props.children === 'k' &&
                  arr[i + 6].props.children === '>') ||
                  ((arr[i + 2].props.children === 'b' ||
                  arr[i + 2].props.children === 'i' ||
                  arr[i + 2].props.children === 'u' ||
                  arr[i + 2].props.children === 's') &&
                  arr[i + 3].props.children === '>')) {
                  let sameStyle = true;
                  for (let j = 0; j < style.length; j++) {
                    if (arr[i + 2 + j].props.children !== style[j]) {
                      sameStyle = false;
                    }
                  }
                  if (sameStyle) {
                    // add tagMatch skip arr
                    tagMatch = true;
                    console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
                    processRecord(i, false);
                    continue;
                  }
                }
              }
              // add to arr w/ style
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
                // console.log(i, style, dataRecord, 'with style');
                console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
                processRecord(i, true, currentStyle, currentValue);
              }
            }
          } else {
            if (arr.length >= style.length  + 2 &&
              arr[i].props.children === '<') {
              if ((arr.length >= 5 &&
                arr[i + 1].props.children === 's' &&
                arr[i + 2].props.children === 'u' &&
                (arr[i + 3].props.children === 'p' ||
                arr[i + 3].props.children === 'b') &&
                arr[i + 4].props.children === '>') ||
                (arr.length >= 6 &&
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
                  // skip arr
                  inTag = true;
                  inStyle = true;
                  console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
                  processRecord(i, false);
                  continue;
                }
              }
            }
            // add to arr w/o style
            // console.log(i, style, dataRecord, 'no style');
            console.log(arr[i].props.children, `inStyle: ${inStyle}`, `inTag: ${inTag}`, `tagMatch: ${tagMatch}`);
            processRecord(i, true);
          }
        }
      });
    }
    return null; // remove null type on top
  };
  processHtml(addDiv(textInput));
  const processColor = (text: string): string => {
    return '';
  };
  const processSprite = (text: string): string => {
    return '';
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
              style={{
                fontWeight: record['style']['fontWeight'],
                fontStyle: record['style']['fontStyle'],
                textDecoration: record['style']['textDecoration'],
                position: record['style']['position'],
                top: record['style']['top'],
                backgroundColor: record['style']['backgroundColor']
              }}
              >{record.text}</div>
          );
        }
        return <></>;
      });
    return resultArr;
  };
  // console.log(dataRecord);

  // const processedText = processHtml(addDiv(textInput));
  const processedText = renderResult();
  // console.log(processedText);
  // const element = document.getElementById('text_container') as HTMLElement;
  // element?.innerHTML += processedText;
  return processedText;
};
