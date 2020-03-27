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

class MasterPointMarMove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultMarMove: [],
            inputId: '',
            inputName: '',
            inputPoint: 0,
            inputPoint1: 0,
            inputMetoo: 0,
            inputMetoo1: 0,
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
        this.getPointMarMove();
    }

    getPointMarMove(){
        axios
        .get('http://10.0.111.212:8090/PointGroup/1/PointMarMove')
        .then((res) => {
            this.setState({
                resultMarMove: res.data.data,
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

    AddMasterPointMarMove = () => {
        axios.post('http://10.0.111.212:8090/PointGroup/1/PointMarMove', {
            pmarmove_id: this.state.inputId,
            pmarmove_name: this.state.inputName,
            pmarmove_point: this.state.inputPoint,
            pmarmove_point1: this.state.inputPoint1,
            pmarmove_metoo: this.state.inputMetoo,
            pmarmove_metoo1: this.state.inputMetoo1,
            pmarmove_userid: "CONVERT",
        }).then((res) => {
            this.getPointMarMove();
          
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
                inputPoint1: 0,
                inputMetoo: 0,
                inputMetoo1: 0,
                responseMessage: res.data.responseMessage,
            });
            this.toggleAddMarMoveModal();
            this.toggleAddConfirmationMarMoveModal();
            this.toggleResponseMarMoveModal();
        });
    };

    editMasterpointMarMove = () => 
    {
        axios.put('http://10.0.111.212:8090/PointGroup/1/PointMarMove/' + this.state.activeItemId, {
            pmarmove_id: this.state.activeItemId,
            pmarmove_name: this.state.activeItemName,
            pmarmove_point: this.state.activeItemPoint,
            pmarmove_point1: this.state.activeItemPoint1,
            pmarmove_metoo: this.state.activeItemMetoo,
            pmarmove_metoo1: this.state.activeItemMetoo1,
            old_marmove_id: this.state.prevCode,
            ptop_userid:"CONVERT"
        })
        .then((res) => {
            this.getPointMarMove();
    
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
                activeItemPoint1: 0,
                activeItemMetoo: 0,
                activeItemMetoo1: 0,
                responseMessage: res.data.responseMessage,
            });

            this.toggleEditConfirmationMarMoveModal();
            this.toggleEditMarMoveModal();
            this.toggleResponseMarMoveModal();
          });
    }
    
    deleteMasterPointMarMove = () => {
        axios.delete('http://10.0.111.212:8090/PointGroup/1/PointMarMove/' + this.state.pmarmove_id)
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
            
            this.getPointMarMove();
            
            this.setState({
                deleteMarMoveModalIsOpen: false
            });
            
            this.toggleResponseMarMoveModal();
        });
    }

    state = {    
        addMarMoveModalIsOpen: false,
        editMarMoveModalIsOpen: false,
        deleteMarMoveModalIsOpen: false,
        
        addConfirmationMarMoveModalIsOpen: false,
        editConfirmationMarMoveModalIsOpen: false,
        responseMarMoveModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "marmoveId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "marmoveName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "marmovePoint"){
            this.setState({
                inputPoint: event.target.value
            });
        } 
        else if(type === "marmoveEditPoint"){
            this.setState({
                activeItemPoint: event.target.value
            });
        }
        else if(type === "marmovePoint1"){
            this.setState({
                inputPoint1: event.target.value
            });
        } 
        else if(type === "marmoveEditPoint1"){
            this.setState({
                activeItemPoint1: event.target.value
            });
        }
        else if(type === "marmoveMeToo"){
            this.setState({
                inputMetoo: event.target.value
            });
        } 
        else if(type === "marmoveEditMeToo"){
            this.setState({
                activeItemMetoo: event.target.value
            });
        }
        else if(type === "marmoveMeToo1"){
            this.setState({
                inputMetoo1: event.target.value
            });
        } 
        else if(type === "marmoveEditMeToo1"){
            this.setState({
                activeItemMetoo1: event.target.value
            });
        }
    };

    toggleAddMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: !this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: this.state.responseMarMoveModalIsOpen,
        })
    }

    toggleEditMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: !this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: this.state.responseMarMoveModalIsOpen,
        })
    }

    openMarMoveModalWithItemID(id, name, point, point1, metoo, metoo1){
        this.setState({
            editMarMoveModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            activeItemPoint1: point1,
            activeItemMetoo: metoo,
            activeItemMetoo1: metoo1,
            prevCode: id
        })
    }

    toggleDeleteMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: !this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: this.state.responseMarMoveModalIsOpen,
        })
    }

    deleteMarMoveModalWithItemID(code){
        this.setState({
            deleteMarMoveModalIsOpen: true,
            pmarmove_id: code,
        })
    }

    toggleAddConfirmationMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: !this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: this.state.responseMarMoveModalIsOpen,
        });
    }

    toggleEditConfirmationMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: !this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: this.state.responseMarMoveModalIsOpen,
        })
    }

    toggleResponseMarMoveModal = () => {
        this.setState({
            addMarMoveModalIsOpen: this.state.addMarMoveModalIsOpen,
            editMarMoveModalIsOpen: this.state.editMarMoveModalIsOpen,
            deleteMarMoveModalIsOpen: this.state.deleteMarMoveModalIsOpen,
            
            addConfirmationMarMoveModalIsOpen: this.state.addConfirmationMarMoveModalIsOpen,
            editConfirmationMarMoveModalIsOpen: this.state.editConfirmationMarMoveModalIsOpen,
            responseMarMoveModalIsOpen: !this.state.responseMarMoveModalIsOpen,
        })
    };

render() {
    const { resultMarMove } = this.state;
    return (
        <div>
                
            {/* Add Modal MarMove */}
            <Modal
            isOpen={this.state.addMarMoveModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddMarMoveModal.bind(this)}
                >Add MarMove Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("marmoveId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("marmoveName", e)} />
                    
                    <br/>
                
                    <Label>Reguler</Label>
                
                    <Input
                    type="text"
                    placeholder="Reguler"
                    onInput={(e) => this.handleChange("marmovePoint", e)} />

                    <br/>

                    <Label>Special</Label>

                    <Input
                      type="text"
                      placeholder="Special"
                      onInput={(e) => this.handleChange("marmovePoint1", e)} />
                      
                    <br/>
                    
                    <Label>Metoo 1</Label>
                    
                    <Input
                      type="text"
                      placeholder="Metoo 1"
                      onInput={(e) => this.handleChange("marmoveMeToo", e)} />
                    
                    <br/>
                    
                    <Label>Metoo 2</Label>
                    
                    <Input
                      type="text"
                      placeholder="Metoo 2"
                      onInput={(e) => this.handleChange("marmoveMeToo1", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationMarMoveModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddMarMoveModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation MarMove Modal */}
            <Modal
            isOpen={this.state.addConfirmationMarMoveModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleAddConfirmationMarMoveModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>

                <ModalBody>
                    Apakah Anda yakin ingin menambah data ini? (MarMove)
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
                    ()=>this.AddMasterPointMarMove()
                }><MdDone
                style={{
                    marginRight: "5"
                }}/>Ya
                </Button>

                <Button
                color="secondary"
                onClick={this.toggleAddConfirmationMarMoveModal.bind(this)}
                ><MdClose
                style={{
                    marginRight: "5"
                }}/>Tidak
                </Button>

                </ModalFooter>

            </Modal>

            {/* Edit MarMove Modal */}
            <Modal
            isOpen={this.state.editMarMoveModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleEditMarMoveModal.bind(this)}
                >Edit MarMove
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
                    
                    <Label>Reguler</Label>
                    
                    <Input
                    type="text"
                    value={this.state.activeItemPoint}
                    onInput={(e) => this.handleChange("marmoveEditPoint",e)}
                    />
                    
                    <br/>
                    
                    <Label>Special</Label>
                    
                    <Input
                    type="text"
                    value={this.state.activeItemPoint1}
                    onInput={(e) => this.handleChange("marmoveEditPoint1",e)}
                    />
                    
                    <br/>
                    
                    <Label>MeToo1</Label>
                    
                    <Input
                    type="text"
                    value={this.state.activeItemMetoo}
                    onInput={(e) => this.handleChange("marmoveEditMeToo",e)}
                    />
                    
                    <br/>
                    
                    <Label>MeToo2</Label>
                    
                    <Input
                    type="text"
                    value={this.state.activeItemMetoo1}
                    onInput={(e) => this.handleChange("marmoveEditMeToo1",e)}
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
                        onClick={()=> this.toggleEditConfirmationMarMoveModal()}>
                            <MdSave
                            style={{marginRight: "5"}}>
                            </MdSave>Simpan
                        </Button>
                        
                        <Button
                        color="danger"
                        onClick={this.toggleEditMarMoveModal}>
                            <MdClose
                            style={{marginRight: "5"}}/>Batal
                        </Button>
                    </ModalFooter>
            </Modal>

            {/* Confirm Edit MarMove Modal */}
            <Modal
            isOpen={this.state.editConfirmationMarMoveModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationMarMoveModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (MarMove)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointMarMove()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationMarMoveModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete MarMove Modal */}
            <Modal
            isOpen={this.state.deleteMarMoveModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteMarMoveModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (MarMove)
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
                        ()=>this.deleteMasterPointMarMove()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteMarMoveModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response MarMove Modal */}
            <Modal
                isOpen={this.state.responseMarMoveModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseMarMoveModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseMarMoveModal.bind(this)}
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
            onClick={this.toggleAddMarMoveModal.bind(this)}
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
                        >REGULER</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                        }}
                        >SPECIAL</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                        }}
                        >METOO1</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                        }}
                        >METOO2</th>
                        
                        <th
                        className={"align-middle"}
                        style={{
                            textAlign: "right"
                        }}
                        >ACTION</th>
                        
                    </tr>
                </thead>
                
                <tbody>
                    {resultMarMove.map((pmarmove) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{pmarmove.pmarmove_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pmarmove.pmarmove_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pmarmove.pmarmove_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pmarmove.pmarmove_point1}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pmarmove.pmarmove_metoo}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{pmarmove.pmarmove_metoo1}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openMarMoveModalWithItemID(
                                pmarmove.pmarmove_id, pmarmove.pmarmove_name, pmarmove.pmarmove_point,
                                pmarmove.pmarmove_point1, pmarmove.pmarmove_metoo, pmarmove.pmarmove_metoo1)}
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
                            onClick={()=>this.deleteMarMoveModalWithItemID(pmarmove.pmarmove_id)}
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

export default MasterPointMarMove;