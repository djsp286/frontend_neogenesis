import Page from 'components/Page';
import React from 'react';
import {
  Card, CardBody, Col, Row , CardHeader , Input, Button, 
  Form, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  UncontrolledButtonDropdown, DropdownToggle, DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {MdVisibility , MdSearch, MdAdd,MdDelete,MdClose,MdDone
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MasterProdukMasterAdd from 'pages/master_c/MasterProduk/MasterProdukMaster/MasterProdukMasterAdd';
import MasterProdukMasterDetEdit from 'pages/master_c/MasterProduk/MasterProdukMaster/MasterProdukMasterDetEdit'
import axios from 'axios'


class MasterProduk extends React.Component {

  constructor(props) {
    super(props);
    this.state = {   
      result: [],
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
      activeProcode:'',
      value:0
    };
  }

  componentDidMount(){
    this.getProductMaster();
  };

  getProductMaster=()=>{
    axios
    .get('https://api.docnet.id/CHCMasterProduk/Product?page=' + this.state.page + '&length=' + this.state.length)
    .then((res) => {
      if(res.data.data != null ){
        this.setState({
          result: res.data.data,
        })
      } else{
        this.setState({
          noDataMessage: "block"
        })
      }

      this.setState({
        maxPage: res.data.metadata.max_page
      })
    })
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

  deleteProductMaster = () => {
    axios.delete('https://api.docnet.id/CHCMasterA/HapusKlaBPOM', {
      data: {
        pro_code: this.state.code,
      }
    })
    .then((res) => {
      
      if (res.data.responseCode === 200){
        this.setState({
          responseHeader: "BERHASIL MENGHAPUS DATA"
        })
      } else {
        this.setState({
          responseHeader: "GAGAL MENGHAPUS DATA"
        })
      }

      this.setState({
        responseMessage: res.data.responseMessage,
      });

      this.getProductMaster();
      this.componentDidMount();
      this.setState({
        deleteModalIsOpen:false
      })
      this.toggleResponseModal();
    });
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
      this.getProductMaster();
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

  lastPage = () => {
    this.setState({
      page: this.state.maxPage,
    }, () => {
      this.paginationHandler();
    });
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: (evt.target.value).trim()
    });
  }

  searchTypeHandle(evt){
    if (evt.target.value === "Tampilkan Semua") {
      this.setState({
          keyword: "",
          page: 1,
          disabled: true,
          tampilkanSemuaDataDisplay: "none",
        },
        () => this.getProductMaster());
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

  searchByType = () => {
    if (this.state.keyword === "" || this.state.keyword === null){
      this.setState({
        page: 1,
        noDataMessage: "none"
      }, () => this.getProductMaster());
    }

    else if(this.state.searchType === "Nama"){
      axios.get('https://api.docnet.id/CHCMasterA/CariKlaBPOMDgnNama', {
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
        axios.get('https://api.docnet.id/CHCMasterProduk/Product?kode=' + this.state.keyword)
          .then((res) => {
            if (res.data.data.length === 0) {
              this.setState({
                noDataMessage: "none"
              })
            } else {
              this.setState({
                noDataMessage: "block"
              })
            }
            this.setState({
              result: res.data.data
            },
            ()=>console.log("hasil search:",this.state.result));
          });
      }
    }
  };

  limitHandler = (evt) => {
    this.setState({
        length: evt.target.value,
        page: 1,
      }, 
      () => {
        this.getProductMaster();
      }
    )
  }

  toggleDeleteModal = () => {
    this.setState({
      deleteModalIsOpen: !this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      responseModalIsOpen: this.state.responseModalIsOpen,
    })
  }

  deleteModalWithItemID(code, name){
    this.setState({
      deleteModalIsOpen: true,
      code: code,
      name: name,
    });
  }
  
  toggleResponseModal = () => {
    this.setState({
      deleteModalIsOpen: this.state.deleteModalIsOpen,
      confirmationModalIsOpen: this.state.confirmationModalIsOpen,
      responseModalIsOpen: !this.state.responseModalIsOpen,
    });
  }

  showTable = () => {
    this.setState({
      value: 0
    });
  }

  showAdd = () => {
    this.setState({
      value: 1
    });
  }

  showDet = (code) => {
    this.setState({
      activeProcode: code,
      value: 2
    })
  }

  render() {
    const { result, value } = this.state;

    return (
      
      <Page
      title="Master Produk">
              
        {
          value === 0 
          && 
          <div>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
              <UncontrolledButtonDropdown
                    style={{
                      marginRight: "1.5vw"
                    }}
                  >
                    <DropdownToggle
                      caret
                    >
                    {this.state.searchType}
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

                <Input
                type="search"
                placeholder="Cari..."
                style={{
                  display:this.state.tampilkanSemuaDataDisplay,
                }}
                disabled={this.state.disabled}
                onChange={evt => this.updateSearchValue(evt)}
                />

                <Button
                id={"searchBtn"}
                style={{
                  alignItems: "center",
                  display:this.state.tampilkanSemuaDataDisplay,
                  marginLeft:"0.5vw",
                  marginRight:"0.5vw",
                }}
                onClick={() => {
                  this.setState({
                    page: 1
                  },
                  () => this.searchByType());
                }}
                color={"primary"}
                >
                  <MdSearch
                  style={{
                    marginRight: "5"
                  }}
                  />Cari
                </Button>

                <Button
                color="primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  float:"right",
                }}
                onClick={()=>this.showAdd()}
                >
                  <MdAdd
                  style={{
                  marginRight: "5"
                  }}>
                    </MdAdd>Tambah
                </Button>
              </CardHeader>

              <CardBody>

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

                <Form>
                  <Table
                  responsive
                  style={{
                    marginTop:"1%"
                  }}
                  >
                    <thead>
                      <tr>
                        <th
                        className={"align-middle"}
                        style={{
                        }}
                        >Prod. Code</th>
                        <th
                        className={"align-middle"}
                        style={{   
                        }}
                        >Prod. Name</th>
                        <th
                        className={"align-middle"}
                        style={{
                            textAlign: "middle",
                        }}
                        >Action</th>
                      </tr>
                    </thead>
                        
                    <tbody>
                      {result.map((product) =>
                        <tr>
                          <th
                          scope="row"
                          className={"align-middle"}
                          >
                            {product.pro_code}
                          </th>
                          
                          <td
                          className={"align-middle"}
                          >
                            {product.pro_name}
                          </td>

                          <td
                          className={"align-middle"}
                          > 
                            <Button
                            onClick={() => this.showDet(product.pro_code)}
                            color="primary"
                            size="md"
                            style={{
                              display: "inline-flex",
                              justifyContent: 'center',
                              alignItems: 'middle',
                              marginLeft: ".5vw",
                            }}
                            >
                              <MdVisibility/>
                            </Button>

                            {/* <Button
                            onClick={()=>this.deleteModalWithItemID(product.pro_code,product.pro_name)}
                            color="danger"
                            size="md"
                            style={{
                              marginLeft: ".5vw",
                              display: "inline-flex",
                              justifyContent: 'center',
                              alignItems: 'middle',
                            }}>
                              <MdDelete/>
                            </Button> */}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <p
                  className={"text-center"}
                  style={{
                    display: this.state.noDataMessage
                  }}
                  >
                    Tidak ada hasil
                  </p>
                      
                  <hr/>
                      
                </Form>

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
                    onClick={this.firstPage.bind(this)}
                    >
                      { "<<" }
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.previousPage.bind(this)}
                    >
                      { "<" }
                    </Button>

                    <Button
                    disabled
                    color={"dark"}
                    >
                      {this.state.page} / {this.state.maxPage}
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.nextPage.bind(this)}
                    >
                      { ">" }
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.lastPage.bind(this)}
                    >
                      { ">>" }
                    </Button>
                  </Form>
              </CardBody>
            </Card>
          </div>}

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
            >
              <MdDone
              style={{
                marginRight: "5"
              }}
              />Ya
            </Button>

            <Button
            color="secondary"
            onClick={this.toggleDeleteModal.bind(this)}
            >
              <MdClose
              style={{
                marginRight: "5"
              }}
              />Tidak
            </Button>
            
          </ModalFooter>
        </Modal>
        {/* Delete Modal */}

        {
          value === 1 && 
          <div>
            <MasterProdukMasterAdd 
            func={() => this.showTable()}
            />
          </div>
        }

        {
          value === 2 
          &&
          <div>
            <MasterProdukMasterDetEdit 
            func={() => this.showTable()} 
            activeProcode={this.state.activeProcode}
            />
          </div>
        }
        
      </Page>
    )
  }
}

export default MasterProduk; 