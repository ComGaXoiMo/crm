import * as React from "react"

import { inject, observer } from "mobx-react"
import { AppComponentListBase } from "@components/AppComponentBase"
import ReactToPrint from "react-to-print"
import { L } from "@lib/abpUtility"
import { Button, message } from "antd"
import {
  portalLayouts,
  publicLayout,
} from "@components/Layout/Router/router.config"
import withRouter from "@components/Layout/Router/withRouter"
import ProposalStore from "@stores/activity/proposalStore"
import Stores from "@stores/storeIdentifier"
export interface IProposalProps {
  history: any;
  params: any;
  proposalStore: ProposalStore;
}

@inject(Stores.ProposalStore)
@observer
class Proposal extends AppComponentListBase<IProposalProps> {
  printRef: any = React.createRef();
  state = {};

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey })
  };
  componentDidMount = async () => {
    this.props.proposalStore.get(this.props.params?.id)

    const div = document.createElement("div")
    div.id = "proposalImage"
    div.className = "modalProposal"
    div.innerHTML = `
  <div><span id="close" class="close">&times;</span>
 
  <a class="prev" onclick="plusSlides(-1)">❮</a>
<a class="next" onclick="plusSlides(1)">❯</a></div>
    `
    document.body.appendChild(div)
    //add scrip
    const script = document.createElement("script")
    script.innerHTML = `
    var modal = document.getElementById("proposalImage");
    var span = document.getElementById("close");
    span.onclick = function() { 
      modal.style.display = "none";
      const boxes = Array.from(document.getElementsByClassName('mySlides'));

      boxes.forEach(box => {
        box.remove();
      })
    }
    let slideIndex = 1;
    function openModel(theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); 
        xmlHttp.send( null );
        var obj = JSON.parse(xmlHttp.response);

        obj.result.forEach((img, index) => {
          console.log(index, img.fileUrl)
          var elemDiv = document.createElement('div');
          elemDiv.className = "mySlides fade";
          var elemText = document.createElement("div");
          elemText.className = "numbertext";
          elemText.innerHTML =index+1
          elemDiv.appendChild(elemText);

          var elemImg = document.createElement("img");
          elemImg.setAttribute("src", img.fileUrl);
          elemImg.setAttribute("style", "max-height:800px");
          elemImg.setAttribute("alt", img.fileName);
          elemDiv.appendChild(elemImg);
          modal.appendChild(elemDiv);
        })

        showSlides(slideIndex);
        modal.style.display = "block";
    }
  
    function plusSlides(n) {
      showSlides(slideIndex += n);
    }
    
    function currentSlide(n) {
      showSlides(slideIndex = n);
    }
    
    function showSlides(n) {
      let i;
      let slides = document.getElementsByClassName("mySlides");
      if (n > slides.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = slides.length}
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
      }
      slides[slideIndex-1].style.display = "flex";  
    }
    `
    document.body.appendChild(script)
  };
  renderProposal = async () => {
    return { __html: this.props.proposalStore.proposalDetail?.contentAfter }
  };
  onClose = () => {
    this.props.history.push({
      pathname: portalLayouts.inquiries.path.replace(
        ":id",
        this.props.params?.id
      ),
      search: "proposal",
    })
  };

  coppyLink = () => {
    const path = publicLayout.proposalPublic.path.replace(
      ":id",
      this.props.proposalStore.proposalDetail?.uniqueId
    )
    const host = location.protocol + "//" + location.host
    const link = host + path
    navigator.clipboard.writeText(link)
    message.success({
      type: "success",
      content: `Proposal link is: ${link}`,
      duration: 1,
      style: {
        marginTop: "90vh",
      },
    })
  };

  public render() {
    const { proposalDetail } = this.props.proposalStore
    return (
      <>
        <div className="proposal-header modul-lable-name">
          <strong>{L("PROPOSAL")}</strong>
          <div>
            <Button
              size="small"
              onClick={this.onClose}
              className="button-secondary"
            >
              {L("CLOSE")}
            </Button>

            <Button
              size="small"
              onClick={this.coppyLink}
              className="button-primary"
            >
              {L("COPPY_LINK")}
            </Button>

            <ReactToPrint
              trigger={() => (
                <Button size="small" className="button-primary">
                  {L("EXPORT_TO_PDF")}
                </Button>
              )}
              documentTitle={L("PROPOSAL")}
              pageStyle="@page { size: A3; margin-top: 10px; }"
              removeAfterPrint
              content={() => this.printRef.current}
            />
          </div>
        </div>
        <div className="proposal-body">
          <div
            ref={this.printRef}
            style={{ height: "100%", padding: 20 }}
            dangerouslySetInnerHTML={{
              __html:
                proposalDetail?.contentAfter ?? proposalDetail?.contentBefore,
            }}
          />
        </div>
        <style>
          {`
            @media print {
              #scrollableDiv {
                width: 100%;
                height: 100% !important;
                overflow: visible;
              }
            }
            `}
        </style>
      </>
    )
  }
}

export default withRouter(Proposal)
