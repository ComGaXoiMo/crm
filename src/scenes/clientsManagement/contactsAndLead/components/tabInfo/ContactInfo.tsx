import React from "react";

import { Col, Form, Row, Select, Input, Button } from "antd";
import { L } from "@lib/abpUtility";
import { validateMessages } from "@lib/validation";
// import companyService from "@services/clientManagement/companyService";
import AppConsts, { GENDERS } from "@lib/appconst";
import { inject, observer } from "mobx-react";
import Stores from "@stores/storeIdentifier";
import { AppComponentListBase } from "@components/AppComponentBase";
import AppDataStore from "@stores/appDataStore";
import ContactStore from "@stores/clientManagement/contactStore";
import { addItemToList, filterOptions, renderOptions } from "@lib/helper";
import rules from "./validation";
import EmailsInput from "@components/Inputs/EmailsInput";
import userService from "@services/administrator/user/userService";
import TextArea from "antd/lib/input/TextArea";
import PhonesInput2 from "@components/Inputs/PhoneInput/PhoneInput2";
import withRouter from "@components/Layout/Router/withRouter";
import AddressInput2 from "@components/Inputs/AddressInput2";
import PhoneCheckInput from "@components/Inputs/PhoneInput/PhoneCheckInput";
import companyService from "@services/clientManagement/companyService";
import RequestModal from "./requestModal";
import { debounce } from "lodash";
import { DeleteOutlined } from "@ant-design/icons";
// import AddressText from "@components/Inputs/AddressText"

const { contactType, formVerticalLayout } = AppConsts;
// const { Option } = Select;

export interface IContactFormProps {
  appDataStore: AppDataStore;
  contactStore: ContactStore;
  id: any;
  isCreate: any;
  isEdit: boolean;
  fomRef: any;
  onClose: any;
  visible: boolean;
  onCheckPhone: any;
}
export interface IStates {
  assignedUsers: any[];
  isShowFull: boolean;
  companyType: any;
  existPhoneVisible: boolean;
  listCompany: any[];
}

@inject(Stores.AppDataStore, Stores.ContactStore)
@observer
class ContactDetail extends AppComponentListBase<IContactFormProps, IStates> {
  state = {
    assignedUsers: [] as any,
    isShowFull: false,
    companyType: undefined,
    existPhoneVisible: false,
    listCompany: [] as any,
  };
  formRef: any = this.props.fomRef;
  formRequest = React.createRef<any>();
  componentDidUpdate = async (prevProps) => {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        await this.initData();

        await Promise.all([]);
      }
    }
  };
  async componentDidMount() {
    this.initData();
    this.getListCompany("");
  }

  initData = () => {
    if (
      this.props.contactStore.editContact &&
      this.props.contactStore.editContact.id
    ) {
      const { contactUser, typeId } = this.props.contactStore.editContact;
      this.setState({
        assignedUsers: (contactUser || []).map((user) => ({
          id: user.userId,
          displayName: user.user.displayName,
        })),
      });
      this.setState({ companyType: typeId });
      const newListCompany = [...this.state.listCompany];
      addItemToList(newListCompany, {
        id: this.props.contactStore.editContact?.companyId,
        name: this.props.contactStore.editContact?.company?.businessName,
      });
      this.props.contactStore.editContact?.companyContact.map((item) => {
        addItemToList(newListCompany, {
          id: item?.companyId,
          name: item?.company?.businessName,
        });
      });
      this.setState({ listCompany: newListCompany });
    }
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      existPhoneVisible: !prevState.existPhoneVisible,
    }));
  };
  handleOk = async () => {
    const formValues = await this.formRequest.current?.validateFields();
    const res = {
      ...formValues,
      contactId: this.props.contactStore?.checkContact?.id,
    };

    await this.props.contactStore.createRequestShareByUser(res);
    await this.toggleModal();
    await this.props.onClose();
  };
  findAssignedUsers = async (keyword: string) => {
    const result = await userService.findUsers({
      keyword,
      pageSize: 20,
      pageNumber: 1,
    });
    this.setState({ assignedUsers: result || [] });
  };
  getListCompany = async (keyword) => {
    const result = await companyService.getAll({
      keyword,
      maxResultCount: 10,
      skipC0unt: 0,
    });
    const listCompany = [...result.items];

    listCompany.map((i) => {
      return { id: i.id, name: i.businessName };
    });
    await this.setState({ listCompany: listCompany });
  };
  findCompanies = debounce(async (keyword) => {
    this.getListCompany(keyword);
  }, 200);
  onChangeCompany = async (value) => {
    const res = await companyService.get(value);
    value = res.companyAddress[0];

    this.formRef.current?.setFieldsValue({
      contactAddress: [{ ...value, id: undefined }],
    });
  };
  // onChangeOtherCompany = async (value, filedName) => {
  //   const res = await companyService.get(value)
  //   value = res.companyAddress[0]
  //   const currentOtherCompany =
  //     this.formRef.current?.getFieldValue("companyContact")
  //   currentOtherCompany[filedName] = {
  //     ...currentOtherCompany[filedName],
  //     address: value,
  //   }
  //   this.formRef.current?.setFieldValue("companyContact", currentOtherCompany)
  // }
  checkPhone = async (phone) => {
    await this.props.onCheckPhone(phone);
    if (this.props.contactStore.checkContact) {
      this.setState({
        companyType: this.props.contactStore.checkContact.typeId,
      });
      if (
        this.props.contactStore.checkContact?.isOwner &&
        this.props.contactStore.checkContact?.companyId
      ) {
        const newListCompany = [...this.state.listCompany];
        const newItem = {
          id: this.props.contactStore.checkContact?.companyId,
          name: this.props.contactStore.checkContact?.company?.businessName,
        };
        addItemToList(newListCompany, newItem);
        this.props.contactStore.checkContact?.companyContact.map((item) => {
          addItemToList(newListCompany, {
            id: item?.companyId,
            name: item?.company?.businessName,
          });
        });
        this.setState({ listCompany: newListCompany });
      }
    }
  };

  changeContact = (name: string, value: boolean) => {
    if (!this.props.contactStore.editContact) {
      return;
    }

    this.props.contactStore.editContact = {
      ...this.props.contactStore.editContact,
      [name]: value,
    };
  };

  render() {
    const {
      appDataStore: { nationality, countryFull, positionLevels, leadSource },
    } = this.props;
    const { checkContact } = this.props.contactStore;
    // const { assignedUsers } = this.state;

    return (
      <Form
        layout="vertical"
        ref={this.formRef}
        validateMessages={validateMessages}
      >
        <Row gutter={[8, 0]}>
          <Col sm={{ span: 24 }}>
            <Row gutter={[8, 0]}>
              {!this.props.id && (
                <Col
                  sm={{ span: 24 }}
                  style={{ lineHeight: "0.2", marginBottom: 7 }}
                >
                  <Form.Item
                    label={L("CONTACT_PHONE")}
                    name="contactPhone"
                    rules={rules.contactPhone}
                  >
                    <PhoneCheckInput
                      onChange={() =>
                        this.props.contactStore.resetExistContact()
                      }
                      disableProps={!this.state.isShowFull}
                      onCheckPhone={this.checkPhone}
                    />
                  </Form.Item>
                  {checkContact?.isOwner === false && (
                    <div>
                      <a style={{ color: "red " }}>
                        Phone Number already exists.
                        <a
                          onClick={() => {
                            this.setState({ existPhoneVisible: true });
                          }}
                          style={{
                            textDecoration: "underline",
                            fontWeight: 600,
                            color: "red",
                          }}
                        >
                          View More
                        </a>
                      </a>
                    </div>
                  )}
                </Col>
              )}
              <Col sm={{ span: 4 }}>
                <Form.Item
                  label={L("CONTACT_GENDER")}
                  {...formVerticalLayout}
                  name="gender"
                  rules={rules.gender}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    disabled={!this.props.isEdit}
                    allowClear
                    filterOption={false}
                    className="full-width"
                  >
                    {renderOptions(GENDERS)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 8 }}>
                <Form.Item
                  label={L("CONTACT_NAME")}
                  {...formVerticalLayout}
                  name="contactName"
                  rules={rules.contactName}
                >
                  <Input disabled={!this.props.isEdit} />
                </Form.Item>
              </Col>

              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("CONTACT_NATIONALITY")}
                  {...formVerticalLayout}
                  name="nationalityId"
                  rules={rules.nationalityId}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    filterOption={filterOptions}
                    className="full-width"
                    disabled={!this.props.isEdit}
                  >
                    {renderOptions(nationality)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 24 }}>
                <Col sm={{ span: 8, offset: 4 }}>
                  <Form.Item
                    label={L("CONTACT_NAME_VI")}
                    {...formVerticalLayout}
                    name="contactNameVi"
                    rules={rules.contactNameVi}
                  >
                    <Input disabled={!this.props.isEdit} />
                  </Form.Item>
                </Col>
              </Col>

              {this.props.id && (
                <Col sm={{ span: 12 }}>
                  <Form.Item
                    label={L("CONTACT_PHONE")}
                    {...formVerticalLayout}
                    name="contactPhone"
                    rules={rules.contactPhone}
                  >
                    <PhonesInput2
                      disableProps={!this.state.isShowFull}
                      disabled={!this.props.isCreate && !this.props.isEdit}
                      suffix={!this.props.isCreate}
                    />
                  </Form.Item>
                </Col>
              )}
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("CONTACT_EMAIL")}
                  {...formVerticalLayout}
                  name="contactEmail"
                  rules={rules.contactEmail}
                >
                  <EmailsInput
                    disabled={!this.props.isEdit}
                    disabledProps={!this.state.isShowFull}
                  />
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("CONTACT_TYPE")}
                  {...formVerticalLayout}
                  name="typeId"
                  rules={[{ required: true }]}
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    disabled={!this.props.isEdit}
                    onChange={(value) => this.setState({ companyType: value })}
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(contactType)}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={{ span: 12 }}>
                <Form.Item
                  label={L("CONTACT_SOURCE")}
                  {...formVerticalLayout}
                  name="leadSourceId"
                >
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    allowClear
                    disabled={!this.props.isEdit}
                    filterOption={filterOptions}
                    className="full-width"
                  >
                    {renderOptions(leadSource)}
                  </Select>
                </Form.Item>
              </Col>
              {this.state.companyType === 2 && (
                <>
                  <Col sm={{ span: 24 }}>
                    <Form.Item
                      rules={rules.required}
                      label={L("COMPANY")}
                      {...formVerticalLayout}
                      name="companyId"
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        showSearch
                        disabled={!this.props.isEdit}
                        onSearch={this.findCompanies}
                        filterOption={filterOptions}
                        onChange={(value) => this.onChangeCompany(value)}
                        className="full-width"
                      >
                        {renderOptions(this.state.listCompany)}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("CONTACT_POSITION_LEVEL")}
                      {...formVerticalLayout}
                      name="levelId"
                    >
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        allowClear
                        filterOption={filterOptions}
                        disabled={!this.props.isEdit}
                        className="full-width"
                      >
                        {renderOptions(positionLevels)}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col sm={{ span: 12 }}>
                    <Form.Item
                      label={L("CONTACT_POSITION_TITLE")}
                      {...formVerticalLayout}
                      name="title"
                    >
                      <Input maxLength={50} disabled={!this.props.isEdit} />
                    </Form.Item>
                  </Col>
                  <Col sm={{ span: 12, offset: 12 }}>
                    <Form.Item
                      label={L("CONTACT_POSITION_TITLE_VI")}
                      {...formVerticalLayout}
                      name="titleVi"
                    >
                      <Input maxLength={50} disabled={!this.props.isEdit} />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("CONTACT_LOCATION")}
                  {...formVerticalLayout}
                  name="contactAddress"
                >
                  <AddressInput2
                    disabled={!this.props.isEdit}
                    countries={countryFull}
                    hasAddressVi={true}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* OTHER CONTACT */}
            {this.state.companyType === 2 && (
              <>
                <Row gutter={[8, 8]}>
                  <Form.List name="companyContact">
                    {(fields, { add, remove }) => (
                      <>
                        <Col sm={{ span: 24 }} style={{ textAlign: "right" }}>
                          <Button
                            disabled={!this.props.isEdit}
                            className="button-primary"
                            onClick={() => add()}
                          >
                            {L("ADD_MORE_COMPANY")}
                          </Button>
                        </Col>

                        {fields.map((field) => (
                          // <Card key={field.key} className="custom-card-overview">
                          <Col sm={{ span: 24 }} key={field.key}>
                            <Row gutter={[8, 0]}>
                              <Col sm={{ span: 12 }}>{L("OTHER_COMPANY")} </Col>
                              <Col
                                sm={{ span: 12 }}
                                style={{ textAlign: "right" }}
                              >
                                <Button
                                  icon={<DeleteOutlined />}
                                  disabled={!this.props.isEdit}
                                  className="custom-buttom-drawe"
                                  onClick={() => remove(field.name)}
                                ></Button>
                              </Col>
                              <Col sm={{ span: 24 }}>
                                <Row gutter={[8, 0]}>
                                  <Col sm={{ span: 24 }}>
                                    <Form.Item
                                      rules={rules.required}
                                      label={L("COMPANY")}
                                      {...formVerticalLayout}
                                      name={[field.name, "companyId"]}
                                    >
                                      <Select
                                        getPopupContainer={(trigger) =>
                                          trigger.parentNode
                                        }
                                        showSearch
                                        disabled={!this.props.isEdit}
                                        onSearch={this.findCompanies}
                                        filterOption={filterOptions}
                                        // onChange={(value) =>
                                        //   this.onChangeOtherCompany(
                                        //     value,
                                        //     field.name
                                        //   )
                                        // }
                                        className="full-width"
                                      >
                                        {renderOptions(this.state.listCompany)}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col sm={{ span: 12 }}>
                                    <Form.Item
                                      {...formVerticalLayout}
                                      name={[field.name, "levelId"]}
                                    >
                                      <Select
                                        getPopupContainer={(trigger) =>
                                          trigger.parentNode
                                        }
                                        placeholder={L(
                                          "CONTACT_POSITION_LEVEL"
                                        )}
                                        allowClear
                                        filterOption={filterOptions}
                                        disabled={!this.props.isEdit}
                                        className="full-width"
                                      >
                                        {renderOptions(positionLevels)}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                  <Col sm={{ span: 12 }}>
                                    <Form.Item
                                      {...formVerticalLayout}
                                      name={[field.name, "title"]}
                                    >
                                      <Input
                                        placeholder={L(
                                          "CONTACT_POSITION_TITLE"
                                        )}
                                        maxLength={50}
                                        disabled={!this.props.isEdit}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                              {/* <Col sm={{ span: 12 }}>
                                <Form.Item
                                  label={L("CONTACT_LOCATION")}
                                  {...formVerticalLayout}
                                  name={[field.name, "address"]}
                                >
                                  <AddressText
                                    disabled
                                    countries={countryFull}
                                  />
                                </Form.Item>
                              </Col> */}
                            </Row>
                          </Col>
                          // </Card>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Row>
              </>
            )}
            <Row gutter={[8, 0]}>
              <Col sm={{ span: 24 }}>
                <Form.Item
                  label={L("CONTACT_DESCRIPTION")}
                  {...formVerticalLayout}
                  name="description"
                  rules={rules.contactDescription}
                >
                  <TextArea disabled={!this.props.isEdit} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <RequestModal
          visible={this.state.existPhoneVisible}
          onClose={this.toggleModal}
          // data={editUnitStatusConfig}
          onOk={this.handleOk}
          formRef={this.formRequest}
          isLoading={this.props.contactStore.isLoading}
        />
      </Form>
    );
  }
}

export default withRouter(ContactDetail);
