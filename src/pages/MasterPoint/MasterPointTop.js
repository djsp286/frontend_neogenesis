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

class MasterPointTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultTop: [],
            inputId: '',
            inputName: '',
            inputPoint: 0,
            page: 1,
            length: 5,
            maxPage: 1,
            responseHeader: '',
            responseMessage: '',
            noDataMessage: 'none',
            // activeItemPoint:0
        };
    }

    componentDidMount(){
        this.getPointTop();
    }

    getPointTop(){
        axios
        .get('http://10.0.111.212:8090/PointGroup/1/PointTOP')
        .then((res) => {
            this.setState({
                resultTop: res.data.data,
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

    AddMasterPointTop = () => {
        axios.post('http://10.0.111.212:8090/PointGroup/1/PointTOP', {
            ptop_id: this.state.inputId,
            ptop_name: this.state.inputName,
            ptop_point: this.state.inputPoint,
            ptop_userid: "CONVERT",
        }).then((res) => {
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
            this.toggleAddTopModal();
            this.toggleAddConfirmationTopModal();
            this.toggleResponseTopModal();
        });
    };

    editMasterpointTop = () => 
    {
        axios.put('http://10.0.111.212:8090/PointGroup/1/PointTOP/' + this.state.activeItemId, {
            ptop_id: this.state.activeItemId,
            ptop_name: this.state.activeItemName, 
            ptop_point: this.state.activeItemPoint,
            ptop_userid: "CONVERT"
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

            this.toggleEditConfirmationTopModal();
            this.toggleEditTopModal();
            this.toggleResponseTopModal();
          });
    }
    
    deleteMasterPointTop = () => {
        axios.delete('http://10.0.111.212:8090/PointGroup/1/PointTOP/' + this.state.ptop_id)
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
                deleteTopModalIsOpen: false
            });
            
            this.toggleResponseTopModal();
        });
    }

    state = {    
        addTopModalIsOpen: false,
        editTopModalIsOpen: false,
        deleteTopModalIsOpen: false,
        
        addConfirmationTopModalIsOpen: false,
        editConfirmationTopModalIsOpen: false,
        responseTopModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "topId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "topName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "topPoint"){
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

    toggleAddTopModal = () => {
        this.setState({
            addTopModalIsOpen: !this.state.addTopModalIsOpen,
            editTopModalIsOpen: this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: this.state.responseTopModalIsOpen,
        })
    }

    toggleEditTopModal = () => {
        this.setState({
            addTopModalIsOpen: this.state.addTopModalIsOpen,
            editTopModalIsOpen: !this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: this.state.responseTopModalIsOpen,
        })
    }

    openTopModalWithItemID(id, name, point){
        this.setState({
            editTopModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            prevCode: id
        })
    }

    toggleDeleteTopModal = () => {
        this.setState({
            addTopModalIsOpen: this.state.addTopModalIsOpen,
            editTopModalIsOpen: this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: !this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: this.state.responseTopModalIsOpen,
        })
    }

    deleteTopModalWithItemID(code){
        this.setState({
            deleteTopModalIsOpen: true,
            ptop_id: code,
        })
    }

    toggleAddConfirmationTopModal = () => {
        this.setState({
            addTopModalIsOpen: this.state.addTopModalIsOpen,
            editTopModalIsOpen: this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: !this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: this.state.responseTopModalIsOpen,
        },()=>console.log(this.state.addConfirmationTopModalIsOpen));
    }

    toggleEditConfirmationTopModal = () => {
        this.setState({
            addTopModalIsOpen: this.state.addTopModalIsOpen,
            editTopModalIsOpen: this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: !this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: this.state.responseTopModalIsOpen,
        })
    }

    toggleResponseTopModal = () => {
        this.setState({
            addTopModalIsOpen: this.state.addTopModalIsOpen,
            editTopModalIsOpen: this.state.editTopModalIsOpen,
            deleteTopModalIsOpen: this.state.deleteTopModalIsOpen,
            
            addConfirmationTopModalIsOpen: this.state.addConfirmationTopModalIsOpen,
            editConfirmationTopModalIsOpen: this.state.editConfirmationTopModalIsOpen,
            responseTopModalIsOpen: !this.state.responseTopModalIsOpen,
        })
    };

render() {
    const { resultTop } = this.state;
    return (
        <div>
                
            {/* Add Modal Top */}
            <Modal
            isOpen={this.state.addTopModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddTopModal.bind(this)}
                >Add Top Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    name="top_id"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("topId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    name="top_name"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("topName", e)} />
                    
                    <br/>
                
                    <Label>Point</Label>
                
                    <Input
                    type="text"
                    name="top_point"
                    placeholder="Point"
                    onInput={(e) => this.handleChange("topPoint", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationTopModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddTopModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation Modal */}
            <Modal
                isOpen={this.state.addConfirmationTopModalIsOpen}>
                <ModalHeader
                toggle={this.toggleAddConfirmationTopModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>
                <ModalBody>
                Apakah Anda yakin ingin menambah data ini? (Top)
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
                    ()=>this.AddMasterPointTop()
                    }
                    ><MdDone
                    style={{
                    marginRight: "5"
                    }}
                />Ya
                </Button>
                <Button
                    color="secondary"
                    onClick={this.toggleAddConfirmationTopModal.bind(this)}
                ><MdClose
                    style={{
                    marginRight: "5"
                    }}
                />Tidak
                </Button>
                </ModalFooter>
            </Modal>

            {/* Edit Top Modal */}
            <Modal
            isOpen={this.state.editTopModalIsOpen}>
                <ModalHeader
                toggle={this.toggleEditTopModal.bind(this)}
                >Edit Top
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
                        onClick={()=> this.toggleEditConfirmationTopModal()}>
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

            {/* Confirm Edit Top Modal */}
            <Modal
            isOpen={this.state.editConfirmationTopModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationTopModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (Top)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointTop()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationTopModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Top Modal */}
            <Modal
            isOpen={this.state.deleteTopModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteTopModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (Top)
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
                        ()=>this.deleteMasterPointTop()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteTopModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response Top Modal */}
            <Modal
                isOpen={this.state.responseTopModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseTopModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseTopModal.bind(this)}
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
            onClick={this.toggleAddTopModal.bind(this)}
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
                    {resultTop.map((ptop) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{ptop.ptop_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{ptop.ptop_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{ptop.ptop_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openTopModalWithItemID(ptop.ptop_id, ptop.ptop_name, ptop.ptop_point)}
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
                            onClick={()=>this.deleteTopModalWithItemID(ptop.ptop_id)}
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

export default MasterPointTop;