import React from 'react';
import {
  Button,Table, Modal,
  ModalBody, ModalFooter, ModalHeader, Input, Label
} from 'reactstrap';
import { MdAdd, MdEdit, MdDelete, MdDone, MdClose,MdSave,MdPrint
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios';

class MasterPointGradasi extends React.Component {
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
        this.getPointGradasi()
    }

    getPointGradasi= () => {
      axios
        .get('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointGradasi')
        // .get('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointGradasi')
        .then((res) => {
            if (res.data.data !== null) {
                this.setState({
                    result: res.data.data,
                })
            } else {
                this.setState({
                    result: []
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
            this.getPointGradasi();
        }
        )
    }

    AddMasterPointGradasi = () => {
        axios.post('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointGradasi', {
        // axios.post('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointGradasi', {
            grad_id: this.state.inputId,
            grad_name: this.state.inputName,
            grad_point: parseInt(this.state.inputPoint),
            grad_userid: "CONVERT",
        }).then((res) => {
            // console.log(res)

            this.getPointGradasi();
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
            this.toggleAddGradasiModal();
            this.toggleAddConfirmationGradasiModal();
            this.toggleResponseGradasiModal();
        });
    };

    editMasterpointGradasi = () => 
    {
        axios.put('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointGradasi/' 
        // axios.put('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointGradasi/' 
        + this.state.activeItemId, {
            grad_id: this.state.activeItemId,
            grad_name: this.state.activeItemName, 
            grad_point: parseInt(this.state.activeItemPoint),
            grad_userid: "CONVERT"
        })
        .then((res) => {
            // console.log(res);

            this.componentDidMount();
    
            if (res.status === 200){
                this.setState({
                    responseHeader: "BERHASIL MENYUNTING DATA",
                    responseMessage: "BERHASIL MENYUNTING DATA",
                })
            }
            else {
                this.setState({
                    responseHeader: "GAGAL MENYUNTING DATA",
                    responseMessage: "GAGAL MENYUNTING DATA",
                })
            }
    
            this.setState({
                activeItemId: "",
                activeItemName: "",
                activeItemPoint:0,
                // responseMessage: res.data.responseMessage,
            });

            this.toggleEditConfirmationGradasiModal();
            this.toggleEditGradasiModal();
            this.toggleResponseGradasiModal();
          });
    }
    
    deleteMasterPointGradasi = () => {
        axios.delete('https://api.docnet.id/CHCMasterProduk/PointGroup/' + this.props.groupId + '/PointGradasi/' 
        // axios.delete('http://10.0.111.208:8090/PointGroup/' + this.props.groupId + '/PointGradasi/' 
        + this.state.grad_id)
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
                deleteGradasiModalIsOpen: false
            });
            
            this.toggleResponseGradasiModal();
        });
    }

    state = {    
        addGradasiModalIsOpen: false,
        editGradasiModalIsOpen: false,
        deleteGradasiModalIsOpen: false,
        
        addConfirmationGradasiModalIsOpen: false,
        editConfirmationGradasiModalIsOpen: false,
        responseGradasiModalIsOpen: false,
    };

    handleChange = (type, event) => {
        if (type === "GradasiId") {
            this.setState({
                inputId: event.target.value
            });
        }
        else if (type === "GradasiName") {
            this.setState({
                inputName: event.target.value
            });
        }
        else if(type === "GradasiPoint"){
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

    toggleAddGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: !this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: this.state.responseGradasiModalIsOpen,
        })
    }

    toggleEditGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: !this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: this.state.responseGradasiModalIsOpen,
        })
    }

    openGradasiModalWithItemID(id, name, point){
        this.setState({
            editGradasiModalIsOpen: true,
            activeItemId: id,
            activeItemName:name,
            activeItemPoint: point,
            prevCode: id
        })
    }

    toggleDeleteGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: !this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: this.state.responseGradasiModalIsOpen,
        })
    }

    deleteGradasiModalWithItemID(code){
        this.setState({
            deleteGradasiModalIsOpen: true,
            grad_id: code,
        })
    }

    toggleAddConfirmationGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: !this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: this.state.responseGradasiModalIsOpen,
        }
        // ,()=>console.log(this.state.addConfirmationGradasiModalIsOpen)
        );
    }

    toggleEditConfirmationGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: !this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: this.state.responseGradasiModalIsOpen,
        })
    }

    toggleResponseGradasiModal = () => {
        this.setState({
            addGradasiModalIsOpen: this.state.addGradasiModalIsOpen,
            editGradasiModalIsOpen: this.state.editGradasiModalIsOpen,
            deleteGradasiModalIsOpen: this.state.deleteGradasiModalIsOpen,
            
            addConfirmationGradasiModalIsOpen: this.state.addConfirmationGradasiModalIsOpen,
            editConfirmationGradasiModalIsOpen: this.state.editConfirmationGradasiModalIsOpen,
            responseGradasiModalIsOpen: !this.state.responseGradasiModalIsOpen,
        })
    };

    render(){
        const { result } = this.state;

        return (
            <div>
                
            {/* Add Modal Gradasi */}
            <Modal
            isOpen={this.state.addGradasiModalIsOpen}
            >
                <ModalHeader
                toggle={this.toggleAddGradasiModal.bind(this)}
                >Add Gradasi Point
                </ModalHeader>
                
                <ModalBody>
                    <Label>ID</Label>
                    
                    <Input
                    type="text"
                    name="Gradasi_id"
                    placeholder="ID"
                    maxLength={1}
                    onInput={(e) => this.handleChange("GradasiId", e)} />
                    
                    <br/>
                    
                    <Label>Nama</Label>
                
                    <Input
                    type="text"
                    name="Gradasi_name"
                    placeholder="Nama"
                    onInput={(e) => this.handleChange("GradasiName", e)} />
                    
                    <br/>
                
                    <Label>Point</Label>
                
                    <Input
                    type="text"
                    name="Gradasi_point"
                    placeholder="Point"
                    onInput={(e) => this.handleChange("GradasiPoint", e)} />
                
                </ModalBody>
            
                <ModalFooter
                    style={{
                        display: "inline-block",
                        textAlign: "center"
                    }}
                    >
                        
                    <Button
                    color="primary"
                    onClick={()=> this.toggleAddConfirmationGradasiModal()}
                    >
                        <MdSave
                        style={{marginRight: "5"}}>
                        </MdSave>Simpan
                    </Button>
                    
                    <Button
                    color="danger"
                    onClick={this.toggleAddGradasiModal.bind(this)}
                    >
                        <MdClose
                        style={{marginRight: "5"}}
                        />Batal
                    </Button>
                    
                </ModalFooter>
            </Modal>

            {/* Add Confirmation Modal */}
            <Modal
                isOpen={this.state.addConfirmationGradasiModalIsOpen}>
                <ModalHeader
                toggle={this.toggleAddConfirmationGradasiModal.bind(this)}
                >Konfirmasi Penambahan Data
                </ModalHeader>
                <ModalBody>
                Apakah Anda yakin ingin menambah data ini? (Gradasi)
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
                    ()=>this.AddMasterPointGradasi()
                    }
                    ><MdDone
                    style={{
                    marginRight: "5"
                    }}
                />Ya
                </Button>
                <Button
                    color="secondary"
                    onClick={this.toggleAddConfirmationGradasiModal.bind(this)}
                ><MdClose
                    style={{
                    marginRight: "5"
                    }}
                />Tidak
                </Button>
                </ModalFooter>
            </Modal>

            {/* Edit GradasiModal */}
            <Modal
            isOpen={this.state.editGradasiModalIsOpen}>
                <ModalHeader
                toggle={this.toggleEditGradasiModal.bind(this)}
                >Edit Gradasi
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
                        onClick={()=> this.toggleEditConfirmationGradasiModal()}>
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

            {/* Confirm Edit Gradasi Modal */}
            <Modal
            isOpen={this.state.editConfirmationGradasiModalIsOpen}>

                <ModalHeader
                toggle={this.toggleEditConfirmationGradasiModal.bind(this)}
                >Konfirmasi Penyuntingan
                </ModalHeader>

                <ModalBody>
                Apakah Anda yakin ingin menyunting data ini? (Gradasi)
                </ModalBody>

                <ModalFooter
                style={{
                    display: "inline-block",
                    textAlign: "center"
                }}
                >
                    <Button
                    color="primary"
                    onClick={()=>this.editMasterpointGradasi()}
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleEditConfirmationGradasiModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Delete Gradasi Modal */}
            <Modal
            isOpen={this.state.deleteGradasiModalIsOpen}>
                
                <ModalHeader
                toggle={this.toggleDeleteGradasiModal.bind(this)}
                >Konfirmasi Penghapusan
                </ModalHeader>
                
                <ModalBody>
                    Apakah Anda yakin ingin menghapus data ini? (Gradasi)
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
                        ()=>this.deleteMasterPointGradasi()
                    }
                    ><MdDone
                    style={{
                        marginRight: "5"
                    }}
                    />Ya
                    </Button>
                    
                    <Button
                    color="secondary"
                    onClick={this.toggleDeleteGradasiModal.bind(this)}
                    ><MdClose
                    style={{
                        marginRight: "5"
                    }}
                    />Tidak
                    </Button>
                </ModalFooter>
            </Modal>

            {/* Response Gradasi Modal */}
            <Modal
                isOpen={this.state.responseGradasiModalIsOpen}>
                <ModalHeader
                toggle={this.toggleResponseGradasiModal.bind(this)}
                >{this.state.responseHeader}
                </ModalHeader>
                <ModalBody>
                {this.state.responseMessage}
                </ModalBody>
                <ModalFooter>
                <Button
                    color="primary"
                    onClick={this.toggleResponseGradasiModal.bind(this)}
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
            onClick={this.toggleAddGradasiModal.bind(this)}
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
                    {result.map((Gradasi) =>
                    <tr>
                        <th
                        scope="row"
                        className={"align-middle"}
                        style={{
                            
                        }}
                        >{Gradasi.grad_id}
                        </th>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{Gradasi.grad_name}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            
                        }}>{Gradasi.grad_point}
                        </td>
                        
                        <td
                        className={"align-middle"}
                        style={{
                            // width: "25%",
                            textAlign: "right"
                        }}
                        >
                            
                            <Button
                            onClick={()=>this.openGradasiModalWithItemID(Gradasi.grad_id, Gradasi.grad_name, Gradasi.grad_point)}
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
                            onClick={()=>this.deleteGradasiModalWithItemID(Gradasi.grad_id)}
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

export default MasterPointGradasi;