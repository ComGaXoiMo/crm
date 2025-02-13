import * as React from "react"

import { registerLicense } from "@syncfusion/ej2-base"

import withRouter from "@components/Layout/Router/withRouter"
import { AppComponentListBase } from "@components/AppComponentBase"
import {
  DocumentEditorContainerComponent,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-documenteditor"
import { Button } from "antd"
import { keySyncfusion } from "@lib/appconst"
registerLicense(keySyncfusion)

export interface IProps {
  selectItem: any
  tabKey: any
}
export interface IStates {
  id: any
}
class TestSynfDE extends AppComponentListBase<IProps, IStates> {
  formRef: any = React.createRef()
  rteRef: any = React.createRef()

  state = {
    id: undefined,
  }

  async componentDidMount() {
    await this.initValue()
    this.rendereComplete()
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.selectItem !== this.props.selectItem) {
      if (this.props.selectItem === this.props.tabKey) {
        await this.initValue()
      }
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
  async initValue() {
    console.log()
  }
  loadDefault = async () => {
    const defaultDocument = {
      sfdt: "UEsDBAoAAAAIAOlNkld5ZcNz1BUAAA8gAQAEAAAAc2ZkdO1dW4/jyHX+K4KCAbzAWMvinfM20z037/RMY7p3jcGmEZSkksQdilRIaqbbiwaC9VNeAgRwgjzYgN/yEAQxYAM28uIfs8AuHAfIX0hdeFfxIqqoVmvYL2yxSNZ3vnPq1P3Ut0NvFdpL+xfoYjYNh49Cf40eDgM0GT76+tshvq784aNvh6uPw0eapY0U1bIMTTM1SzG0h8PVYvjIVOWHQ2c5fKSrI8nCf6ZqqEAG4OHQ594N2V1Twn+KpAFDM0x8e0xuayP81elsNXwk4auH2D+L6fCRooxMNf2OZKkPh7OS+2ObvjbGQgxfo4/ncI6GGM3KHT7CGa2C6Dp3A/zAYx+O7QlOdyeeE9AU9Pcf6dUZhxP6JZby9dUt/iglZjUjrIynfkCuIYb5LU5zQnb15+w6jn4v2OUDuZDHbJd+NYQ0FxjQX0HoEriev4TOkDw0ix6fsLxi3cxmFLRNnxoTUeP75P8kZTaDuV/uDOV+Z37iPGwq1T5yCh1M1hD/90lnh3OYQSdAonOG40kwRcPbq9srbHYUwSKCsavVMvt8geAU+Zv2GdkQzhf/N6vMckiK5d9I9O/ZM/yphctKgBNdcOGTiB8IFqxg4JfAtjifeV7Iwzmc0dyfPYtyL9j+Zirj9fT07Ozdu8/Pz158/qVrh4OMhsteee2NPm/y3CsUBAg1+iJcMtXe3hL1JgYWWVJqU7PgF5gyEBndCXTssW9jLtaRo2HeETLfyjzcLKMUSYpLRPzlce7b5Bf7OrXXS3uJggH2s4O33hK6+F04SR+nRpxCiM04e4feOIPOfO0OnnvhAntjLLMQF+tH11nG5RLZmaXB1O6It4+JSYV9T7KL///oJv9/nMRlNjWvcOYwDNMQG7Ci4zuMWuTOGNMfiGvA/EfX2ZLlt2KX6SJcOgzsjAGaeMtVpLGbcMzSwsWSmkgwiS7E2N/MZvaEVHFL+M0sYAkOtWqS6sDQJloJU9oHr+z5IqQmR55AMPl3EgyJbc0IrcOfrSC598Of/vT9d3/4/rs/fv/LX37/3X9FLz8cvoAu1sLwr//+z//7m38Y/M/vf/vXX/0Lu03q1R//8x9//O8/Zx8mAH7419/9+Iff/fBv//SX//gVvksqX64JvUBjn5twuYDUSbrzALqQJOGbT7HRkAJyAx2Ifz5BFNhXWPtT8vv5+hvysYuFvw6JyX2xWJLfZ57nPPF8+tkvyJM4v7U7Z2/4uLAM30L4gbxwwkR6ul4t0NImD5wsEPnEuYPFws0LF4UDcst7j4ge3tk2wXNmT3wv8Gbh4J09eAJtmvmlTWw2k/bCxjU+vIFMOILi7KvBE88hD5+iD/QGZpp6/UvkEFzP4TqES/o1SIxm+AqGC/KBixufFOSnQYjFmiPHGzydYv9Ckt74N+RTX2ALYDKeOTdLesMP7ffkxivoecTXee9PFnC5ot+zXVyyhi+D95grODj3QvqmR/klFwwTuolsX9ko5GrtS2wFOaHJjTXxz8+RR3Vz48wgcoekJC1tt5EVb2G/2OB++PVvGtpsnbXGVXBko/HPyDJPPH9q72aYp3DtniPMfG+XQu0y1tQW1shaFDeJGSbt88h371xJGdLIIlUu0GTNNEyL1VEKq5x0TvuF1u1yVLdvlrS4fpYr6md7Sh+RZC2uoDnfiSpqXgo3ASN0r1OG4gJJGoxYsQNQxVmTJiEoNAn1LYlWtJGqkQwMXbYUS9VYMwCYD4eeQ+tbWsNnq3V8wT1MoJHfjottUCL1fNSw5X5xyirs8Bt2cegr9GGJJar4JUsrPHHF6eVRNasV3ZRIz+q2HYVx1oorNYY9B/SZ2sCOAEsMsRFyjqERGU7RDK6dcHAOfTj34WoxeOa5aZumJDknzW1RZFlMwSZ2ZTGzkpuYFdiqm9+JsuUGypbrlS3fjbJjKRQx+iOKU0q1JWc7vY0JVngEi3DmIh34FlSr4qhWS6lWWlGtHhnVmjiqtVKq1VZUa0dGtS6Oar2Uaq0V1fqRUW2Io9oopVpvRbVxZFSb4qg2S6k2WlFtHhnVlrgWJBGPdAIVxrxVyrxZ6B1ahXZaRJfVWePRKlViFZT9NxOfQMfxPHdwia5DUV14Tu/cjA0XLjC4VGozlTpJYVaa/oyMM72R/c3VSU4onqSlyukAZzu1eNOb7nTCJy3JcgPEkTikVJ6X7hS5ocAhK6COAJlyt3RgaookG8qWpMeQyrAeqQpEDS+UKyGgAw7xRFYbnWCM5fCPVS/KfgtH6n0jf9tMM0qFAPU+vkwx5uHo5QSuQttzxbWg9IplNMngVZOGzonjBbihI9BMZCCPdDJ2rANJ0YCmy83Ka4ykgOxISiZ0XS+ExAgGPpohH7l0Wptr1fmy0/zDobCGBowa6U40jUD9LmimxyKgRJ/ecklK9BG1RDKiBuvxN2gikH59Y/VG+bo5ypzEHbaWIkk2zaSRsi6YWA2G0KVSxfFQHY4OT2GI9tc6L3hfkvmRlIVTb7KmJnMGVx31QGeC+5c5yDw5Gqgmzo4sNjO2Ukw3Pc6ny9UCBnZQQJ2UQLvQOKj7nDvFDgLtuQ+by5UH5UjKDHI/IMdboQGcTn0UBEIb62pJCWq3CHdTSRvgN6TyUbj23Q6dgXBRIsSxJM88x/E+oumLmxXyMa3vCya3pv+zBaZk0b8ZLWptoPpkFe9OK0ekkdF6NXG8kDTfnciuApFVaWSRHp9uqaasynLVKhBVl0Y6eVgxLV01ifllHtY2F4TkOnGFUVRzd51GBOf5ru1M8nDsfzSXgKW+7m1JV4GscAZbfkukC49GAyy6/UWyZF0DihGtRf4pL4W0aLVmzj8PmCvGEc2sVPuAdjtvotkVWa0ZxRdf6CKJ8gLek0LXxMkzX9zYyZMxrOvq9YHbljo5KWVyqx4HgyRyuJaYmQBIIkcqyRYFAZBUgZBUUwgkTSAkXRICSRe5ZFiMeRsCIZlizNsUCMkSY96WSL8kibHvaN69mz5D5ytQY38fy/TKdtHg9Xo5RoX6r1n18coOup7cTFtsbaY9KcAsWrEVizmSaTtSVgxJlzTVEIE3Mw1If4qsd1R5Y9m8AMBKHrDIWknTR5pV3Hq+O2I1j1gTu6nEEEOrlgf5ZO04SOgYF1vNZGW2WNSDilBwkIkrWik2owW2YvmJ7iri0elt0ClcdKp4dFobdCoXnSYendoGXaFEnOC6yHbX6ADW1+TxcFF2XvVsjbNYUpL7HVc52wNVSoB2XdVsj1QtQdpBFbM9uEL5yTb8RJZtc6uyHaHgIOuiRlFaYCuWk+huBzWK3AadwkXXQY0C2qBTueg6qFGkNujSEnEGJ74nfhoxO13BG3cun6/ALl6hjlMxgapbhlz5NHazmpqpECo3xGJXZ0hNd89u7pIuf9bURpKWjy1V/rBljeTKnAFQRmrTrIFs5Px3ZdZABdSFVjyhac2nlgDmCBRWlFU8baojJRuBq/JhyxypTXHQlW2ZKS6l8tOyrOcjgVU+rFYSKmO6QPOcdYvZdsxXdTlQRpWqki2DmjOQZcmQFFBtVAoAI7Np3gqmSMJimYZhyZZuVtuMokojuTkQDZuBVTYfWXxYN2n5bgjElGvMW7Gw7ptmrmLKcuZd7Yi00mJ9dbvrDpXN8AnbT7XQSiDj7jdrgHuyp+aMhPGYo0H9NN1uU/Wt36ZVZOu3xzvlXdLEL9Z7bJyGk9Dpeo6C5vgKrZ9ELpjhXYUAYLKJ3+zCCfLRfNy+uNHlNZmb73L0vskcQhbEkawRIBE+d5hCOHeg3fmuwGTt74m39m1csliEqNxiX7iZHMfLK9zduMnVfEawTVnLdd8AaaXetxChnb4voLNmC7LvrBSlEI6kDF3YcxeGax8dwC6XFMsGumNhO/S9uA4AtZuT6j62Hod26AjSXCYssZIEMeq0JZLgLwp0b1ofl3CM0XqzweN1uPB8O7RRcEgLmhJ8z+w5LkRBJyubZLUdNnGmW4isXbMXSK+PZ6XvbtyXOcu+LDPrltjuwNTfPBbbhK3bqbmnSGiXb06ELkJMl9fRWMBp4GHAiwnXPrDgNkOjqm6MDKt0BEerDUgo1ZultGMg80aKkrvt4UXaiuNDczRUOfxkyGKVwOd+r4Qr4toWlcQCSc+PSwPBVM665UkV7EHa1KcYhiZ4UW5LGLrghbgtYRiCF9+2hGGKbeT4ZRtMMnWNXlXWdqkN9lcnWz1rW7J2MVmg6bq6Tb2PiMtSGmG5piV+J3GOH7suuq4Z7+hpGj69RpPBiQPXgeBOWlTE6BkbTIjqVjGw1JJJPZBM6erVs7Q1ZTf5XKG90P1oUWFnd4bynBpeujOvs5UhUYTymGb+pGmEN28UKWgKMIbso/nagX4nVtOkCo7zj/HMfXQz9q53Le8ypaftHCX37cZzlNy3xzvlXeC5sjiWOSbA9UWgiXuhC6FsgbN2UZ+7JNq/XGZBd1PSs9IXompehDfiq3Cwxdb35urfcbBK2HqKgmkt6kepuuYQ1o1tHRR/MWExgcwwhUYtJN17NbdAjpVXsvArMzgA5LJZ1ORUM4xs7d8McGPX85yx570fFg4ng6VPxROS/MSyNG4BjinKUyY0oKCijnQrt/juGChTCpSJHDjhrJuMKJNyh4WC+0ygyq0whG6jjxaoltaoh1ST5kmIqRG83WVjLXQzuymfkQZd05J6ponjBWgqfp5NKreDfOHhLiYBXSx7iUTNL3l5hT6IDTJRVpXVrxi7mxKSpWGTGkWw4ygs6r4v1CgcaoRWTYZBO2H3hY+0lrn05nMHRW5W+ZQLUqGbAYOJj+b7d6zxfOAFmntocO7btAe9sZ6wkBwxULy7cZMftZaJGku+XDuh7aAPyOl2OvawzSHDQjK0PJ2eQz+8ETdpqtzDkyATFmJa3qKV54eiY6ylxaXJoGAWQ0Zdq15dCQtJiMprNJkiUW3GAx/nP3TtJMpIA4hOhNrrfT1vlvAQczKD19JYgnc24xDnn3Q/R3J/VHC56gg9KVVKT1UVVUqGKrWnqooqNUOV0VNVRZWRocrsqaqiysxQBUDPVRVXAGTJ6ivBarKytSDoq8FqsrL1IOgrwmqy0poQd+3gnbaNEwDJ8qAuN9vK/FmH4nR/Ox3ttr+VrU1KaPj5+d8lRO1vBLEJN8LnZVJRk7HTvgtLWUj4AD0hjIaEEblnhNGQeHIfTZC49XL3nJiUjZgfx5vOke/CJeoJytMRM0T3Vvto1vOTJSNZkfrm9PnTt68fnz3t+cnTsVnC+urqusBHstzG+yAqrOk9Z4cxsWk7fcV+XeAj9c+T9zUbFXbsH5lVawfMrbjYYn1BuQtm8mb7qrrwvip3Z19tl1XPdllPzp87XhDInUSrqFrsYdQZMFmLOMnvJ+xqvUNCQoEVZe+saHWsaHtnRSkYMZC7s+KmsWBSJDG2vtq+piwkI4k9IdeMhqTbrfSMMBpiRsY9IZSFxIf0Zeaa0ZB4kb5Fe81oSHbg9YRQFpLQq/2gQrSEOjuccPrmSU9KxEOy++DV45PeVK4TJpKluqenb59eXPTMZLiIuemHvCNicoPdU69vuV1HPCR9UwdOelO5TphIej3TqY+CoGcmw0VuQFvkaV1xkNaAbQN1gpAXaZi/wTODJYdP8K4bkEYNoTCVUpjdB/nKyJcT+bKTyM80GlVyrRN5j+F0MzKnHn6yXiI37Cqg1zYBP+JhukOM5BXzdEIofCzS1dXEXU6mHKL5BS5YLjou9FMfzsK9RW1r+zHu3kbOUU6tAi6Z9fZj7m4/HNa5Cnnlzb09Dv7XY6WAuFDFHje5sdQOyMQSnKTO4DvO5Bin6OSmeoEKdV0u7VyurQJaeb0diSjUH4cSjp1LHZ9XcW2JaktRG1exoJ4iIJqiXItjM+nndrjoolDB1EDvAUEZFrhUXdroTmZHN6ZB6+UhUEtk6OScho3yIIPG6r6DapDvMLoKuXtsTc+Yp76p3oyvyzcnF+sxCboifhWBkpzxIyTKtV19UoRdclKEmKKZ4SkNNjFNTrkDdxufpMXZHlc1QSyysvEkFrzlziyLz5PdMCXpXIk3X99NYJkrsPCIRIVDKLbRcdNDLJrLrHBlVvcZ7I97lnj5CdbNZVO5smmCg24VD4beyoR5H9hNaI0rtN7x2XvbKJf3/m4y61yZjeP1VAZXYFPkul58mbKOsWM7rodluG0Mz+TCszqFZzaHZ2VOrB1crOCkq0Nzi4EqoWOPfbsYpLL57tD0/Xi3ZOZOTQDrRNBN2bmHIRYA15zL2gpZgzPh+MkUcAb1HoPjxWekf/X65U9ZWN3CQelwIzFipHCT3nu3Hjz3woU9GXz5kt8OrSUgF+4+eUrwYVGToGT4uDz2fAolf5A26ERlpNuh5cd2tPLxwbs59ixtT0tCm1fJMZlkSKJ4FkF2wBg0U59ULH1i0H7Eve4ZdALUYspazO76FnPYF/byYp1ZSBURcntFhKC1O6QVEaEaV0Jf0/vTKF4cSwKFJJAmyYUkOU1SCklKmqQWktQ0SSskaWmSXkjS0ySjkGSkSWYhyUyTrEKSlRG5iANkgIAiEqATOrH95en8wG7EdiqgDaeONIvThsucj5Rrs208XtZmm02II2ZVhrOiGneJIT8AI2xJvsMGkWCkekECxSWoLPMoZ8Bylvafs3xnOSt3lrN6Zzlrd5azfmc5G3eWsxnnfJX388J9li6VjAmWOC3O873X6r1W77V6r8X3WnIXXkvVRzI9BVVWDEmXtDqvxXm+91q91+q9Vu+1+F5L6cJrKfIIaIWx/Eq3xXuh91u93+r9Vu+3+H5LLfitKFbOzXLspePMmZ9RyJv0Rvb3PRsUkyJ6/u+7P+Y9ntR7vN7j9R7vOD2ednAeb59Dar3P631e7/M+NZ+nH5zP2+eAXO/zep/X+7xPzecZB+fz9juc13u93uv1Xu9T83pmF/MQwKxxVMDs5xl6v9T7pd4vlfkl6+BaY2KdWt/a6r1a79U+uRW2G5MJSUQFO9lbwt/bk4mtQOMFpA+3CxggYEhO0UYW7m4CWZYMSQHyllukee9v3ygsaxPeZ2Z1eXNP7la7dXkfaNHefiDna4g8uxFPjeiNny3jd/vNapzdmPcrukGRdy3i/ScPlM/y1eMh0S7QymVD2cl/8N7f1sh/8kD9LN8iOFKy9xrnoci2mrCtfZZvBXXH9p5teY8RJYrsKgm7+mf5ll4jdss3rdbxLIsNrXyPYlwUVRD35h4Y+QZvr4B9K8DMt/t7BexbAVa++wNy3R+d0/05fqXsLyxau25SXyw6KxaiO1PZOBKSdJhtIQD0kUro0i3VlFUZWFt2ojjv76kTdUQm30XQOsG9qGNi+x53r45IDX03rG+E9t2wvhvWK4DTDbt6OJwsWdQqn10m1+xqL+cBwzBzicgBA7ILDeMgG4gwCN1skLbNGG52bgVSSEQZ/u2aDKQPI+QHhEmNMbm7Y2qE4orqGonSzWFo457xf/v/UEsBAhQACgAAAAgA6U2SV3llw3PUFQAADyABAAQAAAAAAAAAAAAAAAAAAAAAAHNmZHRQSwUGAAAAAAEAAQAyAAAA9hUAAAAA",
    }
    this.rteRef.current.documentEditor.open(defaultDocument)
    this.rteRef.current.documentEditor.documentName = "Getting Started"
    this.rteRef.current.documentEditorSettings.showRuler = true
    this.rteRef.current.documentChange = () => {
      this.rteRef.current.documentEditor.focusIn()
    }
  }
  rendereComplete = () => {
    // window.onbeforeunload = function () {
    //   return "Want to save your changes?";
    // };
    this.rteRef.current.documentEditor.pageOutline = "#E0E0E0"
    this.rteRef.current.documentEditor.acceptTab = true
    this.rteRef.current.documentEditor.resize()
    this.loadDefault()
  }
  public render() {
    return (
      <>
        <div>
          <Button onClick={this.getValue}>abcdef</Button>
        </div>
        <div id="documenteditor_container_body">
          <DocumentEditorContainerComponent
            ref={this.rteRef}
            style={{ display: "block" }}
            height={"790px"}
            serviceUrl={
              "https://services.syncfusion.com/react/production/api/documenteditor/"
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
              "Comments",
              "TrackChanges",
              "Separator",
            ]}
            enableToolbar={true}
            locale="vi-VN"
          >
            <Inject services={[Toolbar]} />
          </DocumentEditorContainerComponent>
        </div>
      </>
    )
  }
}

export default withRouter(TestSynfDE)
