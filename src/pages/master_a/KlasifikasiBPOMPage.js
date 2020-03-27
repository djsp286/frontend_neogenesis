import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  UncontrolledButtonDropdown,
} from 'reactstrap';
import { MdAdd, MdClose, MdDelete, MdDone, MdEdit, MdSave, MdSearch } from 'react-icons/md';
import axios from 'axios';
import DropdownToggle from 'reactstrap/es/DropdownToggle';
import * as s_url from '../urlLinkMasterA';

class KlasifikasiBPOMPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      isLoading: false,
      inputCode: '',
      inputName: '',
      searchInput: '',
      searchType: 'Tampilkan Semua',
      disabled: true,
      tampilkanSemuaDataDisplay: "none",
      keyword: '',
      page: 1,
      length: 5,
      maxPage: 1,
      responseHeader: '',
      responseMessage: '',
      noDataMessage: 'none',
    };
    this.cancel = '';
  }

  componentDidMount() {
    this.getKlaBPOM();
    this.toggle('nested_parent');
  };

  getKlaBPOM = () => {
    axios
      .get(s_url.url_CetakKlaBPOM,
      // .get('http://10.0.111.212:8089/TampilSemuaKlaBPOM',
        {
          params: {
            page: this.state.page,
            length: this.state.length,
          }
        })
      .then((res) => {
        this.setState({
          result: res.data.data,
          pagination: 'block',
        })
      })
      .then(this.getMaxPage());
  }

  firstPage = () => {
    this.setState({
      page: 1,
    }, () => {
      this.paginationHandler();
    });
  }

  nextPage = () => {
    if (this.state.page < this.state.maxPage) {
      this.setState({
        page: this.state.page + 1,
      }, () => {
        this.paginationHandler();
      });
    }
  }

  paginationHandler = () => {
    if ((this.state.keyword).trim() !== ""){
      this.searchByType();
    }
    else {
      this.getKlaBPOM();
    }
  }

  previousPage = () => {
    if (this.state.page !== 1){
      this.setState({
        page: this.state.page - 1,
      }, () => {
        this.paginationHandler();
      });
    }
  }

  getMaxPage = () => {

    var config;

    if (this.state.searchType === "Kode") {
      config = {
        params: {
          kla_code: this.state.keyword,
          page: this.state.page,
          length: this.state.length
        }
      }
    } else if (this.state.searchType === "Nama") {
      config = {
        params: {
          kla_name: this.state.keyword,
          page: this.state.page,
          length: this.state.length
        }
      }
    } else {
      config = {
        params: {
          page: this.state.page,
          length: this.state.length
        }
      }
    }

    axios
      .get(s_url.url_KlaBPOM_PageCount, config)
      // .get('http://10.0.111.212:8089/AmbilMaxPage', config)
      .then((res) => {
        this.setState({
          maxPage: res.data
        },
          // () => console.log(this.state.maxPage)
        )
      });
  }

  lastPage = () => {
    this.setState({
      page: this.state.maxPage,
    }, () => {
      this.paginationHandler();
    });

  }

  insertKlaBPOM = () => {
    axios.post(s_url.url_TambahKlaBPOM, {
    // axios.post('http://10.0.111.212:8089/TambahKlaBPOM', {
      kla_code: this.state.inputCode,
      kla_name: this.state.inputName,
      kla_userid: "CONVERT",
      kla_lastupdate: "2019-09-09 09:09:09"
    }).then((res) => {
      this.getKlaBPOM();
      this.componentDidMount();

      if (res.data.responseCode === 200){
        this.setState({
          responseHeader: "BERHASIL MENAMBAHKAN DATA"
        })
      } else {
        this.setState({
          responseHeader: "GAGAL MENAMBAHKAN DATA"
        })
      }

      this.setState({
        inputCode: "",
        inputName: "",
        responseMessage: res.data.responseMessage,
      });
      this.state.modal_nested_parent = false;
      this.state.modal_nested = false;
      this.toggle('nested_parent');
      this.toggleResponseModal();
    });
  };

  editKlaBPOM = () => {
    axios.put(s_url.url_UbahKlaBPOM, {
    // axios.put('http://10.0.111.212:8089/UbahKlaBPOM/' + this.state.prevCode, {
      kla_code: this.state.activeItemId,
      kla_name: this.state.activeItemName,
      old_kla_code: this.state.prevCode,
      kla_userid: "CONVERT",
      kla_lastupdate: "2019-09-09 00:00:00"
    })
      .then((res) => {
        this.getKlaBPOM();
        this.componentDidMount();

        if (res.data.responseCode === 200){
          this.setState({
            responseHeader: "BERHASIL MENYUNTING DATA"
          })
        } else {
          this.setState({
            responseHeader: "GAGAL MENYUNTING DATA"
          })
        }

        this.setState({
          activeItemId: "",
          activeItemName: "",
          responseMessage: res.data.responseMessage,
        });
        // this.setState({
        //   modal_nested_parent:false,
        //   modal_nested:false
        // })
        this.toggle('nested_parent');
        this.toggleEditConfirmationModal();
        this.toggleEditModal();
        this.toggleResponseModal();
      });
  }

  deleteKlaBPOM = () => {
    axios.delete(s_url.url_HapusKlaBPOM, {
    // axios.delete('http://10.0.111.212:8089/HapusKlaBPOM', {
      data : {
        kla_code: this.state.code,
      }
    }).then((res) => {

      if (res.data.responseCode === 200){
        this.setState({
          responseHeader: "BERHASIL MENGHAPUS DATA"
        })
      } else {
        this.setState({
          responseHeader: "GAGAL MENGHAPUS DATA"
        })
      }
    

      this.getKlaBPOM();
      this.componentDidMount();

      this.state.deleteModalIsOpen = false;
      this.toggleResponseModal();
    });
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: (evt.target.value).trim()
    });

    // console.log(evt.target.value);
  }

  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
    editModalIsOpen: false,
    deleteModalIsOpen: false,
    confirmationModalIsOpen: false,
    editConfirmationModalIsOpen: false,
    responseModalIsOpen: false,
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  closeAllModal = () => {
    this.setState(
      this.state.modal_nested = false,
      this.state.modal_nested_parent = false
    )
  }

  handleChange = (type, event) => {
    if (type === "code") {
      this.setState({ inputCode: event.target.value });
    } else if (type === "name") {
      this.setState({ inputName: event.target.value });
    } else if (type === "editcode") {
      this.setState({ activeItemId: event.target.value });
    } else if (type === "editname") {
      this.setState({ activeItemName: event.target.value });
    }
  };

  toggleEditModal = () => {
    this.setState({
      editModalIsOpen: !this.state.editModalIsOpen,
      deleteModalIsOpen: this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
      responseModalIsOpen: this.state.responseModalIsOpen,
    })
  }

  openModalWithItemID(code, name){
    this.setState({
      editModalIsOpen: true,
      activeItemId: code,
      activeItemName: name,
      prevCode: code
    })
  }

  toggleDeleteModal = () => {
    this.setState({
      editModalIsOpen: this.state.editModalIsOpen,
      deleteModalIsOpen: !this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
      responseModalIsOpen: this.state.responseModalIsOpen,
    })
  }

  deleteModalWithItemID(code, name){
    this.setState({
      deleteModalIsOpen: true,
      code: code,
      name: name,
    })
  }

  toggleResponseModal = () => {
    this.setState({
      editModalIsOpen: this.state.editModalIsOpen,
      deleteModalIsOpen: this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
      responseModalIsOpen: !this.state.responseModalIsOpen,
    })
  }

  toggleEditConfirmationModal = () => {
    this.setState({
      editModalIsOpen: this.state.editModalIsOpen,
      deleteModalIsOpen: this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      editConfirmationModalIsOpen: !this.state.editConfirmationModalIsOpen,
      responseModalIsOpen: this.state.responseModalIsOpen,
    })
  }

  searchTypeHandle(evt){
    if (evt.target.value === "Tampilkan Semua") {
      this.setState({
          keyword: "",
          page: 1,
          disabled: true,
          tampilkanSemuaDataDisplay: "none",
        },
        () => this.getKlaBPOM());
    } else {
      this.setState({
        disabled: false,
        tampilkanSemuaDataDisplay: "inline-flex",
      })
    }

    this.setState({
      searchType: evt.target.value
    });
  }

  limitHandler = (evt) => {
    this.setState({
        length: evt.target.value,
        page: 1,
      }, () => {
        this.getKlaBPOM();
      }
    )
  }

  searchByType = () => {
    if (this.state.keyword === "" || this.state.keyword === null){
      this.setState({
        page: 1,
        noDataMessage: "none"
      }, () => this.getKlaBPOM());
    }

    else if(this.state.searchType === "Nama"){
      axios.get(s_url.url_CariNamaKlaBPOM, {
      // axios.get('http://10.0.111.212:8089/CariKlaBPOMDgnNama', {
        params: {
          kla_name: this.state.keyword,
          length: this.state.length,
          page: this.state.page,
        }
      })
        .then((res) => {
          if (res.data.data.length > 0) {
            this.setState({
              noDataMessage: "none"
            })
          } else {
            this.setState({
              noDataMessage: "block"
            })
          }
          this.setState({
            result: res.data.data,
          });
        });
    }

    else {
      if(this.state.searchType === "Kode"){
        axios.get(s_url.url_CariKodeKlaBPOM, {
        // axios.get('http://10.0.111.212:8089/CariKlaBPOMDgnKode', {
          params: {
            kla_code: this.state.keyword
          }
        })
          .then((res) => {
            if (res.data.data.length > 0) {
              this.setState({
                noDataMessage: "none"
              })
            } else {
              this.setState({
                noDataMessage: "block"
              })
            }
            this.setState({
              result: res.data.data,
            });
          });
      }
    }

    this.getMaxPage();
  };

  render() {
    const { result } = this.state;
    return (
      <Page
        title="Klasifikasi BPOM"
        className="KlasifikasiBPOMPage">
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
                <UncontrolledButtonDropdown
                  style={{
                    marginRight: "1.5vw"
                  }}
                >
                  <DropdownToggle
                    caret
                  >{this.state.searchType}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      value="Tampilkan Semua"
                      onClick={evt => this.searchTypeHandle(evt)}>
                      Tampilkan Semua
                    </DropdownItem>
                    <DropdownItem
                      value="Kode"
                      onClick={evt => this.searchTypeHandle(evt)}>
                      Kode
                    </DropdownItem>
                    <DropdownItem
                      value="Nama"
                      onClick={evt => this.searchTypeHandle(evt)}>
                      Nama
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                {/*</Form>*/}

                {/*/!*Option 1*!/*/}
                {/*/!*Search Input & Search Button*!/*/}
                {/*<Form*/}
                {/*  inline*/}
                {/*  className="cr-search-form mr-auto"*/}
                {/*  style={{*/}
                {/*    marginLeft: "auto",*/}
                {/*  }}*/}
                {/*  onSubmit={e => e.preventDefault()}>*/}
                {/*  /!*<MdSearch*!/*/}
                {/*  /!*  className="cr-search-form__icon-search text-danger"/>*!/*/}
                {/*  <Input*/}
                {/*    type="search"*/}
                {/*    placeholder="Search"*/}
                {/*    // className="cr-search-form__input"*/}
                {/*    onChange={evt => this.updateSearchValue(evt)}*/}
                {/*  />*/}
                {/*  <Button*/}
                {/*    color={"primary"}*/}
                {/*    onClick={() => this.searchByType()}>*/}
                {/*    <MdSearch*/}
                {/*      style={{*/}
                {/*        marginRight: "10"*/}
                {/*      }}*/}
                {/*    />Search*/}
                {/*  </Button>*/}
                {/*</Form>*/}
                {/*/!*Search Input & Search Button*!/*/}
                {/*/!*Option 1*!/*/}

                {/*Option 2*/}
                <Input
                  type="search"
                  placeholder="Cari..."
                  style={{
                    marginRight: "1.5vw",
                    display: this.state.tampilkanSemuaDataDisplay,
                  }}
                  disabled={this.state.disabled}
                  onChange={evt => this.updateSearchValue(evt)}
                />
                <Button
                  id={"searchBtn"}
                  style={{
                    display: this.state.tampilkanSemuaDataDisplay,
                    alignItems: "center",
                  }}
                  color={"primary"}
                  onClick={() => {
                    this.setState({
                      page: 1},
                      () => this.searchByType());
                  }}
                  disabled={this.state.disabled}
                >
                  <MdSearch
                    style={{
                      marginRight: "5"
                    }}
                  />Cari
                </Button>
                {/*Option 2*/}

                <Modal
                  isOpen={this.state.modal_nested_parent}
                  toggle={this.toggle('nested_parent')}
                  className={this.props.className}>
                  <ModalHeader
                    toggle={this.toggle('nested_parent')}
                  >Input
                  </ModalHeader>
                  <ModalBody>
                    <Label>Kode</Label>
                    <Input
                      type="text"
                      name="kla_code"
                      placeholder="Kode"
                      maxLength={1}
                      onInput={(e) => this.handleChange("code", e)} />
                    <br/>
                    <Label>Nama</Label>
                    <Input
                      type="text"
                      name="kla_name"
                      placeholder="Nama"
                      onInput={(e) => this.handleChange("name", e)} />
                  </ModalBody>
                  <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={this.toggle('nested')}>
                      <MdSave
                        style={{
                          marginRight: "5"
                        }}
                      />Simpan
                    </Button>
                    <Modal
                      isOpen={this.state.modal_nested}
                      toggle={this.toggle('nested')}>
                      <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                      <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                      <ModalFooter
                        style={{
                          display: "inline-block",
                          textAlign: "center"
                        }}
                      >
                        <Button
                          color="primary"
                          onClick={this.insertKlaBPOM.bind()}>
                          <MdDone
                            style={{
                              marginRight: "5"
                            }}
                          />Ya
                        </Button>
                        <Button
                          color="secondary"
                          onClick={this.toggle('nested')}>
                          <MdClose
                            style={{
                              marginRight: "5"
                            }}
                          />Tidak
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <Button
                      color="secondary"
                      onClick={this.toggle('nested_parent')}>
                      <MdClose
                        style={{marginRight: "5"}}/>Batal
                    </Button>
                  </ModalFooter>
                </Modal>

                {/* Edit Modal */}
                <Modal
                  isOpen={this.state.editModalIsOpen}>
                  <ModalHeader
                    toggle={this.toggleEditModal.bind(this)}
                  >Edit Unit BPOM
                  </ModalHeader>
                  <ModalBody>
                    <Label>Kode</Label>
                    <Input
                      type='text'
                      maxLength={1}
                      name="codeBPOM"
                      value={this.state.activeItemId}
                      onInput={(e) => this.handleChange("editcode",e)}
                    />
                    <br/>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="nameBPOM"
                      value={this.state.activeItemName}
                      onInput={(e) => this.handleChange("editname",e)}
                    />
                  </ModalBody>
                  <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={()=> this.toggleEditConfirmationModal()}
                    >
                      <MdSave
                        style={{marginRight: "5"}}>
                      </MdSave>Simpan
                    </Button>
                    <Button
                      color="danger"
                      onClick={this.toggleEditModal}
                    >
                      <MdClose
                        style={{marginRight: "5"}}/>Batal
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Edit Modal New */}

                {/* Delete Modal */}
                <Modal
                  isOpen={this.state.deleteModalIsOpen}>
                  <ModalHeader
                    toggle={this.toggleDeleteModal.bind(this)}
                  >Konfirmasi Penghapusan
                  </ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini?
                  </ModalBody>
                  <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={()=>this.deleteKlaBPOM()}
                    ><MdDone
                      style={{
                        marginRight: "5"
                      }}
                    />Ya
                    </Button>
                    <Button
                      color="secondary"
                      onClick={this.toggleDeleteModal.bind(this)}
                    ><MdClose
                      style={{
                        marginRight: "5"
                      }}
                    />Tidak
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Delete Modal */}

                {/* Response Modal */}
                <Modal
                  isOpen={this.state.responseModalIsOpen}>
                  <ModalHeader
                    toggle={this.toggleResponseModal.bind(this)}
                  >{this.state.responseHeader}
                  </ModalHeader>
                  <ModalBody>
                    {this.state.responseMessage}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={this.toggleResponseModal.bind(this)}
                    >OK
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Response Modal */}

                {/* Confirm Edit Modal */}
                <Modal
                  isOpen={this.state.editConfirmationModalIsOpen}>
                  <ModalHeader
                    toggle={this.toggleEditConfirmationModal.bind(this)}
                  >Konfirmasi Penyuntingan
                  </ModalHeader>
                  <ModalBody>
                    Apakah Anda yakin ingin menyunting data ini?
                  </ModalBody>
                  <ModalFooter
                    style={{
                      display: "inline-block",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      color="primary"
                      onClick={()=>this.editKlaBPOM()}
                    ><MdDone
                      style={{
                        marginRight: "5"
                      }}
                    />Ya
                    </Button>
                    <Button
                      color="secondary"
                      onClick={this.toggleEditConfirmationModal.bind(this)}
                    ><MdClose
                      style={{
                        marginRight: "5"
                      }}
                    />Tidak
                    </Button>
                  </ModalFooter>
                </Modal>
                {/* Response Modal */}

              </CardHeader>
              <CardBody>

                {/*Show Limit Dropdown*/}
                <UncontrolledButtonDropdown
                  inline
                  style={{
                    color: "white",
                    float: "left",
                  }}
                >
                  <Button>Tampilkan</Button>
                  <DropdownToggle
                    caret
                  >{this.state.length}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      value="5"
                      onClick={evt => this.limitHandler(evt)}
                    >5
                    </DropdownItem>
                    <DropdownItem
                      value="10"
                      onClick={evt => this.limitHandler(evt)}
                    >10
                    </DropdownItem>
                    <DropdownItem
                      value="15"
                      onClick={evt => this.limitHandler(evt)}
                    >15
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
                {/*Show Limit Dropdown*/}

                {/*Add Button*/}
                <Button
                  color="primary"
                  onClick={this.toggle('nested_parent')}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    float: "right"
                  }}>
                  <MdAdd
                    style={{
                      marginRight: "5"
                    }}
                  >
                  </MdAdd>Tambah
                </Button>
                {/*Add Button*/}

                <Table
                  responsive
                  style={{
                    marginTop: "1%"
                  }}
                >
                  <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th
                      style={{
                        textAlign: "right"
                      }}
                    ></th>
                  </tr>
                  </thead>
                  <tbody>
                  {result.map((kla) =>
                    <tr>
                      <th scope="row"
                          style={{
                            width: "25%",
                          }}>{kla.kla_Code}</th>
                      <td
                        style={{
                          width: "40%",
                        }}>{kla.kla_Name}</td>
                      <td
                        style={{
                          width: "35%",
                          textAlign: "right"
                        }}
                      >
                        <Button
                          onClick={()=>this.openModalWithItemID(kla.kla_Code, kla.kla_Name)}
                          color="success"
                          size="md"
                          style={{
                            display: "inline-flex",
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                          <MdEdit>
                          </MdEdit>
                        </Button>
                        <Button
                          onClick={()=>this.deleteModalWithItemID(kla.kla_Code, kla.kla_Name)}
                          color="danger"
                          size="md"
                          style={{
                            marginLeft: "10px",
                            display: "inline-flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <MdDelete>
                          </MdDelete>
                        </Button>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </Table>

                <p
                  className={"text-center"}
                  style={{
                    display: this.state.noDataMessage
                }}>Tidak ada hasil</p>

                <hr/>

                <Form
                  inline
                  className="cr-search-form"
                  onSubmit={e => e.preventDefault()}
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: this.state.pagination,
                  }}>
                  <Button
                    color={"dark"}
                    onClick={this.firstPage.bind(this)}>
                    { "<<" }
                  </Button>
                  <Button
                    color={"dark"}
                    onClick={this.previousPage.bind(this)}>
                    { "<" }
                  </Button>
                  <Button
                    disabled
                    style={{
                    }}
                    color={"dark"}
                  >{this.state.page} / {this.state.maxPage}
                  </Button>
                  <Button
                    color={"dark"}
                    onClick={this.nextPage.bind(this)}>
                    { ">" }
                  </Button>
                  <Button
                    color={"dark"}
                    onClick={this.lastPage.bind(this)}>
                    { ">>" }
                  </Button>
                </Form>

              </CardBody>

            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default KlasifikasiBPOMPage;