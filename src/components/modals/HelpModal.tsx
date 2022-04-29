import React from 'react';
import '../../styles/HelpModal.css';

export const HelpModal: React.FunctionComponent = () => {
  return (
    <div className='help_modal'>
      <div className='help_wrapper'>
        <h2>How to customize your deck name</h2>
        <h3>Text formatting</h3>
        <p>Use the following tags to assign different text styles:</p>
        <br />
        <p>{`<b>`} - increases the <b>font weight</b> of the text.</p>
        <p>{`<i>`} - uses the <i>italic</i> version of the text.</p>
        <p>{`<u>`} - <u>underlines</u> the text.</p>
        <p>{`<s>`} - puts a <s>strikethrough</s> over the text.</p>
        <p>{`<sup>`} - positions the text as a <sup>super</sup>script.</p>
        <p>{`<sub>`} - positions the text as a <sub>sub</sub>script.</p>
        <p>{`<mark>`} - <mark>highlights</mark> the text.</p>
        <p>You can maually type in the tags, select the text then use the button,
          to surround the selected text with the tags, or use the button without
          selected text to insert empty tags.</p>
        <p>Only the opening tag, for example: {`<b>`} is necessary to apply a style.
          Closing tag, for example: {`</b>`} is only needed when you wish to stop
          applying the same style to the rest of the text.</p>
        <h3>Coloring and color gradient</h3>
        <p>Use the color picker to select a color for your text.</p>
        <p>You manually type in the color tags, select the text then use the button
          to surround the selected text with the tags, or use the button without
          selected text to insert empty tags.</p>
        <p>You can use any of the following format to apply the color tags:</p>
        <br />
        <p>{`<#D5934A>`} - full color tag with hexadecimal color code. Add 2 digit
          of opacity at the end if you wish customize the opacity {`<#D5934AD9>`}.</p>
        <p>{`<#F90>`} - short color tag with hexadecimal color code. You can only use
          the shorthand when all 3 pairs of the code are the same.</p>
        <p>{`<color=#D5934A>`} - color tag with specified color code. You can use both
          the long or shorthand form.</p>
        <p>{`<color=#yellow>`} - color tag with color name. Only the following color
          can be used with this form: red, orange, yellow, green, blue, purple, white,
          black.</p>
        <p>Only the opening tag is necessary. You will need the closing tag if you only
          wish to apply the color to a specific part of the text. The closing tag for
          all format of the color tag is {`</color>`}.</p>
        <p>Use the color gradient tool if you wish to quickly apply a range of continuous
          color across the selected text.</p>
        <h3>Sprites</h3>
        <p>You can select the sprite from the sprite list tool, or manually type in
          the sprite tags</p>
        <p>You can use either the number or the name to select the sprite.</p>
        <p>{`<sprite=1>`} - the available number goes from 0 to 61.</p>
        <p>{`<sprite name=Ionia>`} - named sprite tag.</p>
        <p>You can apply the following text formats to sprites: underline, line through,
          and marking.</p>
        <h3>Limit</h3>
        <p>There is a 50 characters limit on deck names.</p>
      </div>
    </div>
  );
};
