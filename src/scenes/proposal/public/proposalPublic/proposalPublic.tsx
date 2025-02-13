import * as React from "react";

import { inject, observer } from "mobx-react";
import { AppComponentListBase } from "@components/AppComponentBase";

import { L } from "@lib/abpUtility";
import { portalLayouts } from "@components/Layout/Router/router.config";
import withRouter from "@components/Layout/Router/withRouter";
import ProposalStore from "@stores/activity/proposalStore";
import Stores from "@stores/storeIdentifier";

export interface IProposalProps {
  history: any;
  params: any;
  proposalStore: ProposalStore;
}

export interface IProposalState {}

@inject(Stores.ProposalStore)
@observer
class ProposalPublic extends AppComponentListBase<
  IProposalProps,
  IProposalState
> {
  formRef: any = React.createRef();
  state = {};

  changeTab = (tabKey) => {
    this.setState({ tabActiveKey: tabKey });
  };
  componentDidMount = async () => {
    await this.props.proposalStore.getPublicProposal(this.props.params?.id);
    await this.props.proposalStore.updateLinkView({
      id: this.props.proposalStore.proposalPublic?.id,
    });

    const div = document.createElement("div");
    div.id = "proposalImage";
    div.className = "modalProposal";
    div.innerHTML = `
  <div><span id="close" class="close">&times;</span>
 
  <a class="prev" onclick="plusSlides(-1)">❮</a>
<a class="next" onclick="plusSlides(1)">❯</a></div>
    `;
    document.body.appendChild(div);
    //add scrip
    const script = document.createElement("script");
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
    `;
    document.body.appendChild(script);
  };
  renderProposal = async () => {
    return { __html: this.props.proposalStore.proposalPublic?.contentAfter };
  };
  onClose = () => {
    this.props.history.push({
      pathname: portalLayouts.inquiries.path.replace(
        ":id",
        this.props.params?.id
      ),
      search: "proposal",
    });
  };
  public render() {
    const { proposalPublic } = this.props.proposalStore;
    return (
      <div style={{ height: "100vh", zIndex: 1 }}>
        <div className="proposal-header modul-lable-name">
          <strong>{L("PROPOSAL")}</strong>
        </div>
        <div className="proposal-body">
          <div
            dangerouslySetInnerHTML={{
              __html:
                proposalPublic?.contentAfter ?? proposalPublic?.contentBefore,
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(ProposalPublic);
