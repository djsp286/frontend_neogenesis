import React from 'react';
import {
  Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
  ModalBody, ModalFooter, ModalHeader, Input, Label, DropdownMenu,
  DropdownItem, UncontrolledButtonDropdown, Form, InputGroupAddon, InputGroup,
} from 'reactstrap';
import { MdAdd, MdEdit, MdDelete, MdDone, MdClose, MdSearch, MdSave,
  MdPrint, MdExitToApp
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import DropdownToggle from 'reactstrap/es/DropdownToggle';

class MasterPointBeaTrans extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputId:'',
            inputName:'',
            inputPoint:0,
            searchType: 'Tampilkan Semua',
            disabled: true,
            tampilkanSemuaDataDisplay: "inline-flex",
            keyword: '',
            page: 1,
            length: 5,
            maxPage: 1,
            responseHeader: '',
            responseMessage: '',
            noDataMessage: 'none',
            currentStatus: 'Not Ready',
            selectedGroup: 'Apotik'
        };
    }

    componentDidMount() {
        this.getPointBeaTrans()
    }

    getPointBeaTrans= () => {
      axios
        .get('http://10.0.111.212:8090/PointGroup/1/PointBeaTrans')
        .then((res) => {
          this.setState({
            result: res.data.data,
          })
        })
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
            this.getPointGroup();
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
        }
        else if (this.state.searchType === "Nama") {
            config = {
                params: {
                    kla_name: this.state.keyword,
                    page: this.state.page,
                    length: this.state.length
                }
            }
        }
        else {
            config = {
                params: {
                    page: this.state.page,
                    length: this.state.length
                }
            }
        }
        
        axios
        .get('http://10.0.111.212:8089/AmbilMaxPage', config)
        .then((res) => {
            this.setState({
                maxPage: res.data
            })
        });
    }

    lastPage = () => {
        this.setState({
            page: this.state.maxPage,
        }, () => {
            this.paginationHandler();
        });
    }

    limitHandler = (evt) => {
        this.setState({
            length: evt.target.value,
            page: 1,
        }, () => {
            this.getPointBeaTrans();
        }
        )
    }

    AddMasterPointBeaTrans = () => {
        axios.post('http://10.0.111.212:8090/PointGroup/1/PointBeaTrans', {
            pbeatrn_id: this.state.inputId,
            pbeatrn_name: this.state.inputName,
            pbeatrn_point: this.state.inputPoint,
            pbeatrn_userid: "CONVERT",
        }).then((res) => {
            this.getPointBeaTrans();
            this.componentDidMount();
          
            if (res.data.responseCode === 200){
                this.setState({
                    responseHeader: "BERHASIL MENAMBAHKAN DATA"
                })
            } 
            else {
                this.setState({
                    responseHeader: "GAGAL MENAMBAHKAN DATA"
                })
            }

            this.setState({
                inputId: "",
                inputName: "",
                inputPoint: 0,
                responseMessage: res.data.responseMessage,
            });
            this.toggleAddBeaTransModal();
            this.toggleAddConfirmationBeaTransModal();
            this.toggleResponseBeaTransModal();
        });
    };

    editMasterpointBeaTrans = () => 
    {
        axios.put('http://10.0.111.212:8090/PointGroup/1/PointBeaTrans/' + this.state.activeItemId, {
            pbeatrn_id: this.state.activeItemId,
            pbeatrn_name: this.state.activeItemName, 
            pbeatrn_point: this.state.activeItemPoint,
            pbeatrn_userid: "CONVERT"
        })
        .then((res) => {
            console.log(res);
            this.componentDidMount();
    
            if (res.data.responseCode === 200){
                this.setState({
                    responseHeader: "BERHASIL MENYUNTING DATA"
                })
            }
            else {
                this.setState({
                    responseHeader: "GAGAL MENYUNTING DATA"
                })
            }
    
            this.setState({
                activeItemId: "",
                activeItemName: "",
                activeItemPoint:0,
                responseMessage: res.data.responseMessage,
            });

            this.toggleEditConfirmationBeaTransModal();
            this.toggleEditBeaTransModal();
            this.toggleResponseBeaTransModal();
          });
    }
    
    deleteMasterPointBeaTrans = () => {
        axios.delete('http://10.0.111.212:8090/PointGroup/1/PointBeaTrans/' + this.state.pbeatrn_id)
        .then((res) => { 
            console.log(res.data);
            if (res.data.responseCode === 200){
                this.setState({
                    responseHeader: "BERHASIL MENGHAPUS DATA"
                })
            }
            else {
                this.setState({
                    responseHeader: "GAGAL MENGHAPUS DATA"
                })
            }
            
            this.setState({
                responseMessage: res.data.responseMessage,
            });
            
            this.componentDidMount();
            
            this.setState({
                deleteBeaTransModalIsOpen: false
            });
            
            this.toggleResponseBeaTransModal();
        });
    }

    state = {    
        addBeaTransModalIsOpen: false,
        editBeaTransModalIsOpen: false,
        deleteBeaTransModalIsOpen: false,
        
        addConfirmationBeaTransModalIsOpen: false,
        editConfirmationBeaTransModalIsOpen: false,
        responseBeaTransModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "BeaTransId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "BeaTransName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "BeaTransPoint"){
            this.setState({
                inputPoint: event.target.value
            });
        } 
        else if(type === "editPoint"){
            this.setState({
                activeItemPoint: event.target.value
            });
        }
    };

    toggleAddBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: !this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: this.state.responseBeaTransModalIsOpen,
        })
    }

    toggleEditBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: !this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: this.state.responseBeaTransModalIsOpen,
        })
    }

    openBeaTransModalWithItemID(id, name, point){
        this.setState({
            editBeaTransModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            prevCode: id
        })
    }

    toggleDeleteBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: !this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: this.state.responseBeaTransModalIsOpen,
        })
    }

    deleteBeaTransModalWithItemID(code){
        this.setState({
            deleteBeaTransModalIsOpen: true,
            pbeatrn_id: code,
        })
    }

    toggleAddConfirmationBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: !this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: this.state.responseBeaTransModalIsOpen,
        },()=>console.log(this.state.addConfirmationBeaTransModalIsOpen));
    }

    toggleEditConfirmationBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: !this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: this.state.responseBeaTransModalIsOpen,
        })
    }

    toggleResponseBeaTransModal = () => {
        this.setState({
            addBeaTransModalIsOpen: this.state.addBeaTransModalIsOpen,
            editBeaTransModalIsOpen: this.state.editBeaTransModalIsOpen,
            deleteBeaTransModalIsOpen: this.state.deleteBeaTransModalIsOpen,
            
            addConfirmationBeaTransModalIsOpen: this.state.addConfirmationBeaTransModalIsOpen,
            editConfirmationBeaTransModalIsOpen: this.state.editConfirmationBeaTransModalIsOpen,
            responseBeaTransModalIsOpen: !this.state.responseBeaTransModalIsOpen,
        })
    };

    render(){
        const { result } = this.state;

        return (
            <div>
                
            {/* Add Modal BeaTrans */}
            <Modal
            isOpen={this.state.addBeaTransModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddBeaTransModal.bind(this)}
                >Add BeaTrans Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    name="BeaTrans_id"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("BeaTransId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    name="BeaTrans_name"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("BeaTransName", e)} />
                    
                    <br/>
                
                    <Label>Point</Label>
                
                    <Input
                    type="text"
                    name="BeaTrans_point"
                    placeholder="Point"
                    onInput={(e) => this.handleChange("BeaTransPoint", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationBeaTransModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddBeaTransModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation Modal */}
            <Modal
                isOpen={this.state.addConfirmationBeaTransModalIsOpen}>
                <ModalHeader
                toggle={this.toggleAddConfirmationBeaTransModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>
                <ModalBody>
                Apakah Anda yakin ingin menambah data ini? (BeaTrans)
                </ModalBody>
                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                <Button
                    color="primary"
                    onClick={
                    ()=>this.AddMasterPointBeaTrans()
                    }
                    ><MdDone
                    style={{
                    marginRight: "5"
                    }}
                />Ya
                </Button>
                <Button
                    color="secondary"
                    onClick={this.toggleAddConfirmationBeaTransModal.bind(this)}
                ><MdClose
                    style={{
                    marginRight: "5"
                    }}
                />Tidak
                </Button>
                </ModalFooter>
            </Modal>

            {/* Edit BeaTransModal */}
            <Modal
            isOpen={this.state.editBeaTransModalIsOpen}>
                <ModalHeader
                toggle={this.toggleEditBeaTransModal.bind(this)}
                >Edit BeaTrans
                </ModalHeader>
                
                <ModalBody>
                    <Label>Kode</Label>

                    <Input
                    disabled
                    type='text'
                    maxLength={1}
                    value={this.state.activeItemId}
                    />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                    
                    <Input
                    disabled
                    type="text"
                    value={this.state.activeItemName}
                    />
                    
                    <br/>
                    
                    <Label>Point</Label>
                    
                    <Input
                    type="text"
                    value={this.state.activeItemPoint}
                    onInput={(e) => this.handleChange("editPoint",e)}
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
                        onClick={()=> this.toggleEditConfirmationBeaTransModal()}>
                            <MdSave
                            style={{marginRight: "5"}}>
                            </MdSave>Simpan
                        </Button>
                        
                        <Button
                        color="danger"
                        onClick={this.toggleEditModal}>
                            <MdClose
                            style={{marginRight: "5"}}/>Batal
                        </Button>
                    </ModalFooter>
            </Modal>

            {/* Confirm Edit BeaTrans Modal */}
            <Modal
            isOpen={this.state.editConfirmationBeaTransModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationBeaTransModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (BeaTrans)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointBeaTrans()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationBeaTransModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete BeaTrans Modal */}
            <Modal
            isOpen={this.state.deleteBeaTransModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteBeaTransModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (BeaTrans)
                </ModalBody>
                
                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={
                        ()=>this.deleteMasterPointBeaTrans()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteBeaTransModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response BeaTrans Modal */}
            <Modal
                isOpen={this.state.responseBeaTransModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseBeaTransModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseBeaTransModal.bind(this)}
                >OK
                </Button>
                </ModalFooter>
            </Modal>

            <UncontrolledButtonDropdown
            inline
            style={{
                color: "white",
                float: "left",
            }}>
                
                <Button
                color="primary"
                >Tampilkan</Button>

                <DropdownToggle
                caret
                color="primary"
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

            <Button
            onClick={this.toggleAddBeaTransModal.bind(this)}
            color="primary"
            size="md"
            style={{
                display: "inline-flex",
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: ".75vw",
                float: "right"
            }}>
                <MdAdd
                style={{
                    marginRight: "1%"
                }}
                />Tambah
            </Button>

            <Table
            responsive
            >
                <thead>
                    <tr>
                        <th
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >KODE</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >NAMA</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >POINT</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                            textAlign: "right",
                        }}
                        >ACTION</th>
                        
                    </tr>
                </thead>
                
                <tbody>
                    {result.map((BeaTrans) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{BeaTrans.pbeatrn_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{BeaTrans.pbeatrn_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{BeaTrans.pbeatrn_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openBeaTransModalWithItemID(BeaTrans.pbeatrn_id, BeaTrans.pbeatrn_name, BeaTrans.pbeatrn_point)}
                            color="success"
                            size="md"
                            style={{
                                display: "inline-flex",
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: ".5vw",
                            }}><MdEdit/>
                            </Button>
                            
                            <Button
                            onClick={()=>this.deleteBeaTransModalWithItemID(BeaTrans.pbeatrn_id)}
                            color="danger"
                            size="md"
                            style={{
                                marginLeft: ".5vw",
                                display: "inline-flex",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}><MdDelete/>
                            </Button>
                        </td>
                    </tr>
                    )}
                </tbody>
            </Table>
        </div>
        )
    }
}

export default MasterPointBeaTrans;