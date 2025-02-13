import "../../../../node_modules/@syncfusion/ej2-base/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-icons/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-buttons/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-inputs/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-lists/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-navigations/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-popups/styles/material.css"
import "../../../../node_modules/@syncfusion/ej2-richtexteditor/styles/material.css"
import "@syncfusion/ej2-base/styles/material.css"
import "@syncfusion/ej2-react-richtexteditor/styles/material.css"
import { registerLicense } from "@syncfusion/ej2-base"
import {
  Count,
  HtmlEditor,
  Inject,
  Image,
  Resize,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
  ToolbarType,
  ToolbarSettingsModel,
} from "@syncfusion/ej2-react-richtexteditor"
import { debounce, isEqual } from "lodash"
import { keySyncfusion } from "@lib/appconst"
import fileService from "@services/common/fileService"
import { LError } from "@lib/abpUtility"
import { message } from "antd"
import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import * as React from "react"

registerLicense(keySyncfusion)

export interface IeditProposalProps {
  proposalUniqueId: any;
}
class SyncfutionRichText extends AppComponentListBase {
  rteRef: any = React.createRef();
  constructor(props) {
    super(props)
    this.state = {
      currentValue: this.props.value || "",
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.value, this.props.value)) {
      this.setState({ currentValue: this.props.value || "" })
    }
  }

  triggerChange = () => {
    const { onChange } = this.props
    if (onChange) {
      onChange(this.state.currentValue)
    }
  };

  handleImageUpload = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"

    fileInput.onchange = (e) => {
      const inputElement = e.target as HTMLInputElement
      const file = inputElement.files?.[0] // Use optional chaining to handle null value

      if (file) {
        // Send the image to the API
        if (file.size <= 5 * 1024 * 1024) {
          this.uploadImage(file)
        } else {
          message.warning(LError("MAX_FILE_SIZE_UPLOAD_{0}_MB", 5))
        }
      }
    }

    fileInput.click()
  };

  uploadImage = async (file) => {
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fileService.uploadImgProposal(
        this.props.proposalUniqueId,
        formData
      )

      const imageUrl = response.fileUrl

      const editor =
        this.rteRef.current?.contentModule?.getEditPanel() as HTMLElement
      const selection = document.getSelection()

      if (selection) {
        const range = selection.getRangeAt(0)
        const img = document.createElement("img")
        img.src = imageUrl
        img.alt = "Uploaded Image"
        range.insertNode(img)
        this.onTextChange(editor.innerHTML)
      }
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  };

  onTextChange = debounce((value) => {
    this.setState({ currentValue: value })
  }, 200);

  render() {
    const fontColor = {
      modeSwitcher: true,
    }

    const fontFamily = {
      items: [
        { text: "Segoe UI", value: "Segoe UI" },
        {
          text: "Open Sans",
          value: "Open Sans, sans-serif",
          command: "Font",
          subCommand: "FontName",
        },
        { text: "Arial", value: "Arial,Helvetica,sans-serif" },
        { text: "Courier New", value: "Courier New,Courier,monospace" },
        { text: "Georgia", value: "Georgia,serif" },
        { text: "Impact", value: "Impact,Charcoal,sans-serif" },
        { text: "Lucida Console", value: "Lucida Console,Monaco,monospace" },
        { text: "Tahoma", value: "Tahoma,Geneva,sans-serif" },
        { text: "Times New Roman", value: "Times New Roman,Times,serif" },
        { text: "Trebuchet MS", value: "Trebuchet MS,Helvetica,sans-serif" },
        { text: "Verdana", value: "Verdana,Geneva,sans-serif" },
      ],
      width: "60px",
    }

    const toolbarSettings: ToolbarSettingsModel = {
      type: ToolbarType.MultiRow,
      items: [
        "Bold",
        "Italic",
        "Underline",
        "StrikeThrough",
        "FontName",
        "FontSize",
        "FontColor",
        "LowerCase",
        "UpperCase",
        "|",
        "Formats",
        "Alignments",
        "OrderedList",
        "UnorderedList",
        "Outdent",
        "Indent",
        "|",
        "CreateLink",
        "|",
        {
          tooltipText: "Insert Image",
          template:
            '<button class="e-tbar-btn e-control e-btn e-lib e-icon-btn" type="button" id="richtexteditor_373116951_0_toolbar_Image" tabindex="-1" data-tabindex="-1" aria-label="Insert Image (Ctrl + Shift + I)" aria-disabled="false" style="width: auto;"><span class="e-btn-icon e-image e-icons"></span></button>',
          click: this.handleImageUpload,
        },
        "|",
        "ClearFormat",
        "SourceCode",
        "|",
        "NumberFormatList",
        "BulletFormatList",
        "Undo",
        "Redo",
      ],
    }

    return (
      <div>
        <RichTextEditorComponent
          fontColor={fontColor}
          fontFamily={fontFamily}
          ref={this.rteRef}
          enableResize={true}
          imageUploadSuccess={this.handleImageUpload}
          readonly={this.props.isNotEdit}
          enableHtmlSanitizer={false}
          value={this.state.currentValue || "<div>no data</div>"}
          toolbarSettings={toolbarSettings}
          height={700}
          iframeSettings={{
            enable: false,
          }}
          saveInterval={1}
          showCharCount
          blur={this.triggerChange}
          change={(e) => this.onTextChange(e?.value)}
        >
          <Inject
            services={[
              Link,
              Image,
              HtmlEditor,
              Toolbar,
              QuickToolbar,
              Count,
              Resize,
            ]}
          />
        </RichTextEditorComponent>
        <style>
          {`
            .e-richtexteditor {
              min-width: 100%;
              max-width: 100%;
            }
          `}
        </style>
      </div>
    )
  }
}

export default withRouter(SyncfutionRichText)
