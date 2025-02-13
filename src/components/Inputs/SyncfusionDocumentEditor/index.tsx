import * as React from "react"

import { registerLicense } from "@syncfusion/ej2-base"

import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor"
import { keySyncfusion } from "@lib/appconst"
registerLicense(keySyncfusion)

export interface IProps {
  rteRef: any
  isNotEdit: boolean
  visible: boolean
  loadFinally: (value) => void
  initValue: any
}
export interface IStates {
  data: any
}
class SynfDocumentEditor extends AppComponentListBase<IProps, IStates> {
  rteRef: any = this.props.rteRef

  state = { data: undefined }

  async componentDidMount() {
    this.rendereComplete()
  }

  async componentDidUpdate(preProps: IProps) {
    if (preProps.isNotEdit !== this.props.isNotEdit) {
      this.rteRef.current.documentEditor.isReadOnly = this.props.isNotEdit
    }
  }
  getValue = async () => {
    const documentEditorInstance = this.rteRef?.current

    // Serialize the content
    const sfdtBlob = await documentEditorInstance.documentEditor.saveAsBlob(
      "Sfdt"
    )

    // Save the content to a Blob without actually saving it to a file
    const reader = new FileReader()
    reader.onload = () => {
      const contentAsString = reader.result
      console.log(contentAsString)
    }
    reader.readAsText(sfdtBlob)
  }

  loadDefault = async () => {
    const defaultDocument = this.props.initValue ?? notData
    await this.rteRef.current.documentEditor.open(defaultDocument)
    await this.props.loadFinally(true)
    this.rteRef.current.documentEditor.enableTrackChanges = false
    this.rteRef.current.documentEditor.documentName = "Getting Started"
    this.rteRef.current.documentEditorSettings.showRuler = true
    this.rteRef.current.documentChange = () => {
      this.rteRef.current.documentEditor.focusIn()
    }
    this.actionSaveDocx()
  }
  rendereComplete = async () => {
    await this.rendereTool()

    await this.loadDefault()
  }

  actionSaveDocx = () => {
    this.rteRef.current.documentEditor.keyDown = (
      args: DocumentEditorKeyDownEventArgs
    ) => {
      const keyCode: number = args.event.which || args.event.keyCode
      const isCtrlKey: boolean =
        args.event.ctrlKey || args.event.metaKey
          ? true
          : keyCode === 17
          ? true
          : false
      const isAltKey: boolean = args.event.altKey
        ? args.event.altKey
        : keyCode === 18
        ? true
        : false
      // 83 is the character code for 'S'
      if (isCtrlKey && !isAltKey && keyCode === 83) {
        //To prevent default save operation, set the isHandled property to true
        args.isHandled = true
        //Download the document in docx format.
        this.rteRef.current.documentEditor.save("template", "Docx")
        args.event.preventDefault()
      } else if (isCtrlKey && isAltKey && keyCode === 83) {
        //Download the document in sfdt format.
        this.rteRef.current.documentEditor.save("template", "Sfdt")
      }
    }
  }

  rendereTool = async () => {
    this.rteRef.current.documentEditor.pageOutline = "#E0E0E0"
    this.rteRef.current.documentEditor.acceptTab = true
    this.rteRef.current.documentEditor.enableTrackChanges = false
    this.rteRef.current.documentEditor.isReadOnly = this.props.isNotEdit
  }
  handleSave = async () => {
    console.log()
  }
  public render() {
    return (
      <div id="documenteditor_container_body">
        <DocumentEditorContainerComponent
          ref={this.rteRef}
          style={{ display: "block" }}
          height={"83vh"}
          serviceUrl={
            "https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
          }
          toolbarItems={[
            "New",
            "Open",
            "Separator",
            "Undo",
            "Redo",
            "Separator",
            "Image",
            "Table",
            "Hyperlink",
            "Bookmark",
            "TableOfContents",
            "Separator",
            "Header",
            "Footer",
            "PageSetup",
            "PageNumber",
            "Break",
            "Separator",
            "Find",
            "Separator",
            "TrackChanges",
          ]}
          enableToolbar={!this.props.isNotEdit}
          restrictEditing={this.props.isNotEdit}
          locale="vi-VN"
        >
          <Inject services={[Toolbar]} />
        </DocumentEditorContainerComponent>
      </div>
    )
  }
}

export default withRouter(SynfDocumentEditor)

const notData = {
  sfdt: "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",
}
