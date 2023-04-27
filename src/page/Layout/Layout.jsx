import React, { useState } from "react";
import Title from "../../components/Title/Title";
import Button from "../../components/Button/Button";
import "./Layout.css";
import { useRef, useEffect } from "react";
import { Editor, Modifier, EditorState, RichUtils } from "draft-js";
import { ContentState } from "draft-js";

const HEADING_TYPE = "header-one";
const BOLD_STYLE = "BOLD";

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
  RED: {
    color: "rgba(255, 0, 0, 1.0)",
  },
};

function Layout() {
  const editor = useRef();
  const localStorageData = JSON.parse(localStorage.getItem("Text"))
  const initialState = localStorageData
    ? EditorState.createWithContent(
        ContentState.createFromText(localStorageData)
      )
    : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const [text, setText] = useState("");

  function handleHashChange(editorState, setEditorState) {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const text = currentBlock.getText().trim();

    if (text.startsWith("# ")) {
      const newContentState = Modifier.setBlockType(
        contentState,
        selectionState,
        HEADING_TYPE
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-type"
      );
      const newSelectionState = selectionState.merge({
        anchorOffset: 2, // skip the # and the space characters
        focusOffset: selectionState.getEndOffset(),
      });

      console.log(text.slice(2));
      const newContentStateWithText = Modifier.replaceText(
        newContentState,
        newSelectionState,
        text.slice(2) // remove the # character
      );

      const newEditorStateWithText = EditorState.push(
        newEditorState,
        newContentStateWithText,
        "replace-text"
      );

      const finalEditorState = EditorState.forceSelection(
        newEditorStateWithText,
        newSelectionState.merge({
          anchorOffset: newSelectionState.getAnchorOffset() - 2, // move the cursor back to the start of the line
          focusOffset: newSelectionState.getAnchorOffset() + 1,
        })
      );
      setEditorState(finalEditorState);
    }

    if (text.startsWith("* ")) {
      const newContentState = Modifier.applyInlineStyle(
        contentState,
        selectionState,
        BOLD_STYLE
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      const newSelectionState = selectionState.merge({
        anchorOffset: 2, // skip the * and the space characters
        focusOffset: selectionState.getEndOffset(),
      });
      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        newSelectionState.merge({
          anchorOffset: newSelectionState.getAnchorOffset() - 2, // move the cursor back to the start of the line
          focusOffset: newSelectionState.getAnchorOffset() + 1,
        })
      );

      setEditorState(RichUtils.toggleInlineStyle(finalEditorState, BOLD_STYLE));
    }

    if (text.startsWith("** ")) {
      const newContentState = Modifier.applyInlineStyle(
        contentState,
        selectionState,
        "RED"
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      const newSelectionState = selectionState.merge({
        anchorOffset: 3, // skip the ** and the space characters
        focusOffset: selectionState.getEndOffset(),
      });
      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        newSelectionState.merge({
          anchorOffset: newSelectionState.getAnchorOffset() - 3, // move the cursor back to the start of the line
          focusOffset: newSelectionState.getAnchorOffset() + 1,
        })
      );

      setEditorState(RichUtils.toggleInlineStyle(finalEditorState, "RED"));
    }

    if (text.startsWith("*** ")) {
      const newContentState = Modifier.applyInlineStyle(
        contentState,
        selectionState,
        "UNDERLINE"
      );

      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      const newSelectionState = selectionState.merge({
        anchorOffset: 4, // skip the ** and the space characters
        focusOffset: selectionState.getEndOffset(),
      });
      const finalEditorState = EditorState.forceSelection(
        newEditorState,
        newSelectionState.merge({
          anchorOffset: newSelectionState.getAnchorOffset() - 4, // move the cursor back to the start of the line
          focusOffset: newSelectionState.getAnchorOffset() + 1,
        })
      );

      setEditorState(
        RichUtils.toggleInlineStyle(finalEditorState, "UNDERLINE")
      );
    }
  }

  function handleChange(newEditorState) {
    setEditorState(newEditorState);
    handleHashChange(newEditorState, setEditorState);
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    setText(plainText);
  }


  useEffect(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, []);

  return (
    <div className="layout">
      <header className="header">
        <Title />
        <Button text={text} />
      </header>
      <div className="myeditor">
        <Editor
          ref={editor}
          customStyleMap={styleMap}
          editorState={editorState}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default Layout;
