import Page from 'components/Page';
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

class MasterPointRetur extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultRetur: [],
            inputId: '',
            inputName: '',
            inputPoint: 0,
            page: 1,
            length: 5,
            maxPage: 1,
            responseHeader: '',
            responseMessage: '',
            noDataMessage: 'none',
        };
    }

    componentDidMount(){
        this.getPointRetur();
    }

    getPointRetur(){
        axios
        .get('http://10.0.111.212:8090/PointGroup/1/PointRetur')
        .then((res) => {
            this.setState({
                resultRetur: res.data.data,
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
            this.getPointTop();
        }
        )
    }

    AddMasterPointRetur = () => {
        axios.post('http://10.0.111.212:8090/PointGroup/1/PointRetur', {
            pretur_id: this.state.inputId,
            pretur_name: this.state.inputName,
            pretur_point: this.state.inputPoint,
            pretur_userid: "CONVERT",
        }).then((res) => {
            this.getPointRetur();
          
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
            this.toggleAddReturModal();
            this.toggleAddConfirmationReturModal();
            this.toggleResponseReturModal();
        });
    };

    editMasterpointRetur = () => 
    {
        axios.put('http://10.0.111.212:8090/PointGroup/1/PointRetur/' + this.state.activeItemId, {
            pretur_id: this.state.activeItemId,
            pretur_name: this.state.activeItemName,
            pretur_point: this.state.activeItemPoint,
            old_retur_id: this.state.prevCode,
            pretur_userid:"CONVERT"
        })
        .then((res) => {
            this.getPointRetur();
    
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
                activeItemPoint: 0,
                responseMessage: res.data.responseMessage,
            });

            this.toggleEditConfirmationReturModal();
            this.toggleEditReturModal();
            this.toggleResponseReturModal();
          });
    }
    
    deleteMasterPointRetur = () => {
        axios.delete('http://10.0.111.212:8090/PointGroup/1/PointRetur/' + this.state.pretur_id)
        .then((res) => { 
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
            
            this.getPointRetur();
            
            this.setState({
                deleteReturModalIsOpen: false
            });
            
            this.toggleResponseReturModal();
        });
    }

    state = {    
        addReturModalIsOpen: false,
        editReturModalIsOpen: false,
        deleteReturModalIsOpen: false,
        
        addConfirmationReturModalIsOpen: false,
        editConfirmationReturModalIsOpen: false,
        responseReturModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "returId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "returName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "returPoint"){
            this.setState({
                inputPoint: event.target.value
            });
        } 
        else if(type === "returEditPoint"){
            this.setState({
                activeItemPoint: event.target.value
            });
        }
    };

    toggleAddReturModal = () => {
        this.setState({
            addReturModalIsOpen: !this.state.addReturModalIsOpen,
            editReturModalIsOpen: this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: this.state.responseReturModalIsOpen,
        })
    }

    toggleEditReturModal = () => {
        this.setState({
            addReturModalIsOpen: this.state.addReturModalIsOpen,
            editReturModalIsOpen: !this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: this.state.responseReturModalIsOpen,
        })
    }

    openReturModalWithItemID(id, name, point, point1, metoo, metoo1){
        this.setState({
            editReturModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            activeItemPoint1: point1,
            activeItemMetoo: metoo,
            activeItemMetoo1: metoo1,
            prevCode: id
        })
    }

    toggleDeleteReturModal = () => {
        this.setState({
            addReturModalIsOpen: this.state.addReturModalIsOpen,
            editReturModalIsOpen: this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: !this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: this.state.responseReturModalIsOpen,
        })
    }

    deleteReturModalWithItemID(code){
        this.setState({
            deleteReturModalIsOpen: true,
            pretur_id: code,
        })
    }

    toggleAddConfirmationReturModal = () => {
        this.setState({
            addReturModalIsOpen: this.state.addReturModalIsOpen,
            editReturModalIsOpen: this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: !this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: this.state.responseReturModalIsOpen,
        });
    }

    toggleEditConfirmationReturModal = () => {
        this.setState({
            addReturModalIsOpen: this.state.addReturModalIsOpen,
            editReturModalIsOpen: this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: !this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: this.state.responseReturModalIsOpen,
        })
    }

    toggleResponseReturModal = () => {
        this.setState({
            addReturModalIsOpen: this.state.addReturModalIsOpen,
            editReturModalIsOpen: this.state.editReturModalIsOpen,
            deleteReturModalIsOpen: this.state.deleteReturModalIsOpen,
            
            addConfirmationReturModalIsOpen: this.state.addConfirmationReturModalIsOpen,
            editConfirmationReturModalIsOpen: this.state.editConfirmationReturModalIsOpen,
            responseReturModalIsOpen: !this.state.responseReturModalIsOpen,
        })
    };

render() {
    const { resultRetur } = this.state;
    return (
        <div>
                
            {/* Add Modal Retur */}
            <Modal
            isOpen={this.state.addReturModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddReturModal.bind(this)}
                >Add Retur Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("returId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("returName", e)} />
                    
                    <br/>
                
                    <Label>Point</Label>
                
                    <Input
                    type="text"
                    placeholder="Point"
                    onInput={(e) => this.handleChange("returPoint", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationReturModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddReturModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation Retur Modal */}
            <Modal
            isOpen={this.state.addConfirmationReturModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleAddConfirmationReturModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>

                <ModalBody>
                    Apakah Anda yakin ingin menambah data ini? (Retur)
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
                    ()=>this.AddMasterPointRetur()
                }><MdDone
                style={{
                    marginRight: "5"
                }}/>Ya
                </Button>

                <Button
                color="secondary"
                onClick={this.toggleAddConfirmationReturModal.bind(this)}
                ><MdClose
                style={{
                    marginRight: "5"
                }}/>Tidak
                </Button>

                </ModalFooter>

            </Modal>

            {/* Edit Retur Modal */}
            <Modal
            isOpen={this.state.editReturModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleEditReturModal.bind(this)}
                >Edit Retur
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
                    onInput={(e) => this.handleChange("returEditPoint",e)}
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
                        onClick={()=> this.toggleEditConfirmationReturModal()}>
                            <MdSave
                            style={{marginRight: "5"}}>
                            </MdSave>Simpan
                        </Button>
                        
                        <Button
                        color="danger"
                        onClick={this.toggleEditReturModal}>
                            <MdClose
                            style={{marginRight: "5"}}/>Batal
                        </Button>
                    </ModalFooter>
            </Modal>

            {/* Confirm Edit Retur Modal */}
            <Modal
            isOpen={this.state.editConfirmationReturModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationReturModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (Retur)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointRetur()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationReturModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Retur Modal */}
            <Modal
            isOpen={this.state.deleteReturModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteReturModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (Retur)
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
                        ()=>this.deleteMasterPointRetur()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteReturModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response Retur Modal */}
            <Modal
                isOpen={this.state.responseReturModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseReturModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseReturModal.bind(this)}
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
            onClick={this.toggleAddReturModal.bind(this)}
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
                            textAlign: "right"
                        }}
                        >ACTION</th>
                        
                    </tr>
                </thead>
                
                <tbody>
                    {resultRetur.map((pretur) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{pretur.pretur_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pretur.pretur_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pretur.pretur_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openReturModalWithItemID(
                                pretur.pretur_id, pretur.pretur_name, pretur.pretur_point,
                                pretur.pretur_point1, pretur.pretur_metoo, pretur.pretur_metoo1)}
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
                            onClick={()=>this.deleteReturModalWithItemID(pretur.pretur_id)}
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
    );
  }
}

export default MasterPointRetur;