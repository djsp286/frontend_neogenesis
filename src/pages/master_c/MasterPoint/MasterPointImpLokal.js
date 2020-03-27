import React from 'react';
import {
  Button, Table, Modal,
  ModalBody, ModalFooter, ModalHeader, Input, Label, DropdownMenu,
  DropdownItem, UncontrolledButtonDropdown
} from 'reactstrap';
import { MdAdd, MdEdit, MdDelete, MdDone, MdClose, MdSave, MdPrint
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';
import DropdownToggle from 'reactstrap/es/DropdownToggle';

class MasterPointImpLokal extends React.Component {
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
        this.getPointImpLokal()
    }

    getPointImpLokal = () => {
      axios
        .get('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointImpLokal')
        // .get('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointImpLokal')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                    result: res.data.data,
                })
            } else {
                this.setState({
                    result: [],
                })
            }
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
        .get('https://api.docnet.id/CHCMasterProduk/AmbilMaxPage', config)
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
            this.getPointImpLokal();
        }
        )
    }

    AddMasterPointImpLokal = () => {
        axios.post('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointImpLokal', {
        // axios.post('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointImpLokal', {
            pimplokal_id: this.state.inputId,
            pimplokal_name: this.state.inputName,
            pimplokal_point: parseInt(this.state.inputPoint),
            pimplokal_userid: "CONVERT",
        }).then((res) => {
            // console.log(res)

            this.getPointImpLokal();
            this.componentDidMount();
          
            if (res.status === 200){
                this.setState({
                    responseHeader: "BERHASIL MENAMBAHKAN DATA",
                    responseMessage: "BERHASIL MENAMBAHKAN DATA",
                })
            } 
            else {
                this.setState({
                    responseHeader: "GAGAL MENAMBAHKAN DATA",
                    responseMessage: "GAGAL MENAMBAHKAN DATA",
                })
            }

            this.setState({
                inputId: "",
                inputName: "",
                inputPoint: 0,
                // responseMessage: res.data.responseMessage,
            });
            this.toggleAddImpLokalModal();
            this.toggleAddConfirmationImpLokalModal();
            this.toggleResponseImpLokalModal();
        });
    };

    editMasterpointImpLokal = () => 
    {
        axios.put('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointImpLokal/' 
        // axios.put('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointImpLokal/' 
        + this.state.activeItemId, {
            pimplokal_id: this.state.activeItemId,
            pimplokal_name: this.state.activeItemName, 
            pimplokal_point: parseInt(this.state.activeItemPoint),
            pimplokal_userid: "CONVERT"
        })
        .then((res) => {
            // console.log(res);

            this.componentDidMount();
    
            if (res.status === 200){
                this.setState({
                    responseHeader: "BERHASIL MENYUNTING DATA",
                    responseMessage: "BERHASIL MENYUNTING DATA"
                })
            }
            else {
                this.setState({
                    responseHeader: "GAGAL MENYUNTING DATA",
                    responseMessage: "GAGAL MENYUNTING DATA"
                })
            }
    
            this.setState({
                activeItemId: "",
                activeItemName: "",
                activeItemPoint:0,
                // responseMessage: res.data.responseMessage,
            });

            this.toggleEditConfirmationImpLokalModal();
            this.toggleEditImpLokalModal();
            this.toggleResponseImpLokalModal();
          });
    }
    
    deleteMasterPointImpLokal = () => {
        axios.delete('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointImpLokal/' 
        // axios.delete('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointImpLokal/' 
        + this.state.pimplokal_id)
        .then((res) => { 
            // console.log(res.data);

            if (res.status === 200){
                this.setState({
                    responseHeader: "BERHASIL MENGHAPUS DATA",
                    responseMessage: "BERHASIL MENGHAPUS DATA",
                })
            }
            else {
                this.setState({
                    responseHeader: "GAGAL MENGHAPUS DATA",
                    responseMessage: "GAGAL MENGHAPUS DATA",
                })
            }
            
            this.setState({
                // responseMessage: res.data.responseMessage,
            });
            
            this.componentDidMount();
            
            this.setState({
                deleteImpLokalModalIsOpen: false
            });
            
            this.toggleResponseImpLokalModal();
        });
    }

    state = {    
        addImpLokalModalIsOpen: false,
        editImpLokalModalIsOpen: false,
        deleteImpLokalModalIsOpen: false,
        
        addConfirmationImpLokalModalIsOpen: false,
        editConfirmationImpLokalModalIsOpen: false,
        responseImpLokalModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "ImpLokalId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "ImpLokalName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "ImpLokalPoint"){
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

    toggleAddImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: !this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: this.state.responseImpLokalModalIsOpen,
        })
    }

    toggleEditImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: !this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: this.state.responseImpLokalModalIsOpen,
        })
    }

    openImpLokalModalWithItemID(id, name, point){
        this.setState({
            editImpLokalModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            prevCode: id
        })
    }

    toggleDeleteImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: !this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: this.state.responseImpLokalModalIsOpen,
        })
    }

    deleteImpLokalModalWithItemID(code){
        this.setState({
            deleteImpLokalModalIsOpen: true,
            pimplokal_id: code,
        })
    }

    toggleAddConfirmationImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: !this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: this.state.responseImpLokalModalIsOpen,
        }
        // ,()=>console.log(this.state.addConfirmationImpLokalModalIsOpen)
        );
    }

    toggleEditConfirmationImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: !this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: this.state.responseImpLokalModalIsOpen,
        })
    }

    toggleResponseImpLokalModal = () => {
        this.setState({
            addImpLokalModalIsOpen: this.state.addImpLokalModalIsOpen,
            editImpLokalModalIsOpen: this.state.editImpLokalModalIsOpen,
            deleteImpLokalModalIsOpen: this.state.deleteImpLokalModalIsOpen,
            
            addConfirmationImpLokalModalIsOpen: this.state.addConfirmationImpLokalModalIsOpen,
            editConfirmationImpLokalModalIsOpen: this.state.editConfirmationImpLokalModalIsOpen,
            responseImpLokalModalIsOpen: !this.state.responseImpLokalModalIsOpen,
        })
    };

    render(){
        const { result } = this.state;

        return (
            <div>
                
            {/* Add Modal ImpLokal */}
            <Modal
            isOpen={this.state.addImpLokalModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddImpLokalModal.bind(this)}
                >Add ImpLokal Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    name="ImpLokal_id"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("ImpLokalId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    name="ImpLokal_name"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("ImpLokalName", e)} />
                    
                    <br/>
                
                    <Label>Point</Label>
                
                    <Input
                    type="text"
                    name="ImpLokal_point"
                    placeholder="Point"
                    onInput={(e) => this.handleChange("ImpLokalPoint", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationImpLokalModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddImpLokalModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation Modal */}
            <Modal
                isOpen={this.state.addConfirmationImpLokalModalIsOpen}>
                <ModalHeader
                toggle={this.toggleAddConfirmationImpLokalModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>
                <ModalBody>
                Apakah Anda yakin ingin menambah data ini? (ImpLokal)
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
                    ()=>this.AddMasterPointImpLokal()
                    }
                    ><MdDone
                    style={{
                    marginRight: "5"
                    }}
                />Ya
                </Button>
                <Button
                    color="secondary"
                    onClick={this.toggleAddConfirmationImpLokalModal.bind(this)}
                ><MdClose
                    style={{
                    marginRight: "5"
                    }}
                />Tidak
                </Button>
                </ModalFooter>
            </Modal>

            {/* Edit ImpLokalModal */}
            <Modal
            isOpen={this.state.editImpLokalModalIsOpen}>
                <ModalHeader
                toggle={this.toggleEditImpLokalModal.bind(this)}
                >Edit ImpLokal
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
                        onClick={()=> this.toggleEditConfirmationImpLokalModal()}>
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

            {/* Confirm Edit ImpLokal Modal */}
            <Modal
            isOpen={this.state.editConfirmationImpLokalModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationImpLokalModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (ImpLokal)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointImpLokal()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationImpLokalModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete ImpLokal Modal */}
            <Modal
            isOpen={this.state.deleteImpLokalModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteImpLokalModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (ImpLokal)
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
                        ()=>this.deleteMasterPointImpLokal()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteImpLokalModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response ImpLokal Modal */}
            <Modal
                isOpen={this.state.responseImpLokalModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseImpLokalModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseImpLokalModal.bind(this)}
                >OK
                </Button>
                </ModalFooter>
            </Modal>

            {/* <UncontrolledButtonDropdown
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
            </UncontrolledButtonDropdown> */}

            {/* <div
            style={{
                float: "right"
            }}            
            > */}

            <Button
            // onClick={this.toggleAddTopModal.bind(this)}
            color="primary"
            size="md"
            style={{
                display: "inline-flex",
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: ".75vw",
                float: "left",
                marginRight: "1.5vw",
            }}>
                <MdPrint
                style={{
                    marginRight: "5"
                }}
                />Print
            </Button>

            <Button
            onClick={this.toggleAddImpLokalModal.bind(this)}
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
                    marginRight: "5"
                }}
                />Tambah
            </Button>

            {/* </div> */}

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
                    {result.map((implokal) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{implokal.pimplokal_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{implokal.pimplokal_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{implokal.pimplokal_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openImpLokalModalWithItemID(implokal.pimplokal_id, implokal.pimplokal_name, implokal.pimplokal_point)}
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
                            onClick={()=>this.deleteImpLokalModalWithItemID(implokal.pimplokal_id)}
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

export default MasterPointImpLokal;