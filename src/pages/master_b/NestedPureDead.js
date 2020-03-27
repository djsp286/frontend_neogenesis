import React from "react";
import {
    Button, Table,
    ModalBody, ModalFooter, ModalHeader, Input, Label,
    Form, FormGroup, Modal, Row, CardBody, Col, InputGroup, InputGroupAddon
} from 'reactstrap';
import {
    MdAutorenew, MdLoyalty, MdDelete
} from 'react-icons/md';
import * as myUrl from '../urlLink'
import * as firebase from 'firebase/app';

const perf = firebase.performance();
const initialCurrentPoint = {
    lpbd_dataaktifyn: "Y",
}

export default class NestedPureDead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            result: [],
            inputtedName: '',
            inputtedNumber: '',
            inputtedProcode: '',
            buttonName: "",
            buttonEditClicked: false,
            currentPoint: { ...initialCurrentPoint },
            newProductDesc: '',
        };
    }

    getKarakterDtlList = (param_charid) => {
        const trace = perf.trace('getProdPureDeadList');
        trace.start();
        const urlA = myUrl.url_getProdPureDeadList;

        var payload = {
            charid: param_charid
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload)
        }
        this.fetchData();
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.props.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.setState({ result: data.result });
                    const newResult = this.state.result.map((file) => {
                        return { ...file, id: "" };
                    });
                    this.setState({ result: newResult, loading: false });
                    this.props.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.props.showNotification("Koneksi ke server gagal!", 'error');
            });
    }

    //modal updateYN
    state = {
        modal_statusData: false,
        modal_statusDataBody: "",
        modal_statusDataTitle: "",
        karakterstatus: {},
    };

    //modal tambah
    state = {
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    toggle = modalType => () => {
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    toggleEditData = (modalType, todo) => () => {
        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
            editPoint: todo,
        });
    }

    toggleStatusData = (todo) => () => {
        var modalTitle = "";
        var modalBody = "";
        if (todo.lpbd_dataaktifyn === "Y") {
            modalTitle = "Konfirmasi Penonaktifan";
            modalBody =
                "Apakah Anda yakin ingin menonaktifkan data ini?"
        } else {
            modalTitle = "Konfirmasi Pengaktifan";
            modalBody = "Apakah Anda yakin ingin mengaktifkan data ini?";
        }
        this.setState({
            modal_statusData: true,
            modal_statusDataTitle: modalTitle,
            modal_statusDataBody: modalBody,
            karakterstatus: todo,
        });
    }

    componentDidMount() {
        !(this.props.judul === "Tambah Pure Dead Produk") && this.getKarakterDtlList(this.props.currentChar.hprodchar_id);
    }

    fetchData = () => {
        this.setState({ loading: true });
    };

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 300);
    }

    searchProcode = (currentProcode) => () => {
        const trace = perf.trace('Product');
        trace.start();
        var url = myUrl.url_Product ;

        const payload ={
            "procodes":[currentProcode]
        }

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body:JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState(
                        {
                            loading: false
                        }
                    );
                }
            }).then(result => {

                var data = result.data;
                if (data === null) {
                    this.props.showNotification("Data tidak ditemukan!", 'error');
                    this.setState({
                        newProductDesc: ''
                    });
                }
                else {
                    data = result.data[0];
                    this.setState({
                        newProductDesc: data.pro_name2

                    })
                    this.setState(prevState => (
                        {
                            currentPoint: {
                                ...prevState.currentPoint, nama: data.pro_name2 ? data.pro_name2 : "",
                                procod: data.pro_code ? data.pro_code : ""
                            }
                        }));
                }
            }).catch((err) => {
                this.props.showNotification("Koneksi ke server gagal!", 'error');
                this.setState(
                    {
                        loading: false
                    }
                );
            });
    }

    updatePointTabel = (todo, aktifyn = null) => (event) => {
        var currentProcode = (this.state.result.map(procod => {
            return procod.lpbd_procod;
        }));
        if ((currentProcode).includes(todo.lpbd_procod) && currentProcode.length > 0 && !(event.target.name).includes('Status')) {
            this.setState({
                modal_nested: false,
                modal_nested_parent: false,
                modal_nested_edit: false,
                modal_nested_parent_edit: false,
                loading: false,
            }, () => {
                this.props.showNotification("Procode sudah terinput!", 'error');
                return;
            });

        } else {
            if ((event.target.name).includes('Tambah')) {
                if (this.TIPE) {
                    todo["id"] = this.state.result.length + 1;
                }
                this.setState(prevState => ({
                    result: [...prevState.result, todo],
                    modal_nested: false,
                    modal_nested_parent: false,
                    loading: false
                }));
            } else if ((event.target.name).includes('Edit')) {
                if (this.TIPE) {
                    this.setState(prevState => ({
                        result: prevState.result.map(
                            el => el.id === todo.id ? { ...todo } : el
                        ), modal_nested_edit: false,
                        modal_nested_parent_edit: false,
                        loading: false
                    }));
                } else {
                    this.setState(prevState => ({
                        result: prevState.result.map(
                            el => el.lpbd_procod === todo.lpbd_procod ? { ...todo } : el
                        ), modal_nested_edit: false,
                        modal_nested_parent_edit: false,
                        loading: false
                    }));
                }
            } else {
                this.setState(prevState => ({
                    result: prevState.result.map(
                        el => el.lpbd_procod === todo.lpbd_procod ? { ...todo, lpbd_dataaktifyn: aktifyn } : el
                    ),
                    modal_statusData: false,
                    loading: false
                }));
            }
        }
    }

    updateInputValue(evt, field, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        } else {
            Point = { ...this.state.editPoint };
        }
        Point[field] = evt.target.value;
        this.setState({
            [`${name}Point`]: Point,
            inputtedProcode: evt.target.value
        });
    }

    updateNumberValue(evt, field, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        } else {
            Point = { ...this.state.editPoint };
        }
        Point[field] = evt.target.value;
        this.setState({
            [`${name}Point`]: Point,
            inputtedNumber: evt.target.value,
        });
    }

    setKarakterActiveYN = (param1) => (event) => {
        if (param1.lpbd_dataaktifyn === "Y") {
            this.updatePointTabel(param1, "N")(event)
        } else {
            this.updatePointTabel(param1, "Y")(event)
        }
    }

    setName = (event) => {
        this.setState({
            inputtedName: event.target.value
        });
    }

    clearForm = () => {
        this.setState({
            inputtedProcode: "",
            inputtedNumber: "",
            inputtedName: '',
            newProductDesc: '',
            currentPoint:
            {
                ...initialCurrentPoint,
            },
        });
    }

    clearPointTable = () => {
        this.setState({
            result: [],
        });
    }

    canBeSubmitted() {
        const { inputtedProcode } = this.state;
        return true
            && (inputtedProcode.length > 0 && inputtedProcode.trim() !== "" && inputtedProcode.trim().length <= 7);
    }

    canBeSubmittedAdd(param) {
        const { inputtedName } = this.state;
        return true
            && (!param ||
                (inputtedName.length > 0 && inputtedName.trim() !== "" && inputtedName.trim().length <= 30));
    }

    render() {
        const currentChar = this.state.result;
        const judul = this.props.judul;
        const TIPE = (judul === "Tambah Pure Dead Produk") ? true : false
        const { loading } = this.state;
        const isEnabled = this.canBeSubmitted();
        const adaData = currentChar && currentChar.length > 0 ? true : false
        const isiTabel = adaData && currentChar.map((todo, i) => {
            return todo.lpbd_dataaktifyn === "Y" && <tr key={i}>
                <th scope="row">{todo.lpbd_procod}</th>
                <td>{todo.nama}</td>
                {
                    <td className="text-center">
                        {!this.TIPE && todo.lpbd_dataaktifyn === "Y" && <Button name="buttonStatus" color="danger" size="sm"
                            onClick={this.toggleStatusData({ ...todo })}><MdDelete /></Button>}
                    </td>
                }
            </tr>
        });

        const tabelPoint = <Table responsive
            striped>
            <thead>
                <tr>
                    <th>Procode</th>
                    <th>Deskripsi Produk</th>
                </tr>
            </thead>
            <tbody>
                {!adaData && <tr>
                    <td style={{ backgroundColor: 'white' }} colSpan='11' className="text-center">TIDAK ADA DATA</td>
                </tr>}
                {isiTabel}
            </tbody>
        </Table>

        const modalBody =
            <Form>
                <FormGroup inline>
                    {!TIPE && <strong>ID Karakteristik: </strong>}
                    {!TIPE && <Label>{this.props.currentChar.hprodchar_id}</Label>}
                </FormGroup>
                <FormGroup className="text-right">

                    {/* MODAL TAMBAH */}
                    <Row>
                        <Col>
                            <CardBody className="d-flex justify-content-between" style={{ paddingTop: "0px", paddingBottom: '0px' }}>
                                <Row>
                                    <strong>Daftar Produk</strong>
                                </Row>

                                <Row>
                                    <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                </Row>
                            </CardBody>
                        </Col>
                    </Row>
                    <Modal
                        onExit={this.clearForm}
                        isOpen={this.state.modal_nested_parent}
                        toggle={this.toggle('nested_parent')}>
                        <ModalHeader toggle={this.toggle('nested_parent')}>
                            Tambah Pure Dead Data
                                    </ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label >Procode</Label>
                                    <InputGroup>
                                        <Input type="input" name="inputtedProcode" autoComplete="off" value={this.state.inputtedProcode} onChange={evt => this.updateInputValue(evt, "lpbd_procod", "current")}
                                            placeholder="Masukkan Procode" />
                                        <InputGroupAddon addonType="append">
                                            <Button style={{ width: '100px', textAlign: 'center' }} onClick={this.searchProcode(this.state.inputtedProcode)}>
                                                Cari
                                                        </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>

                                <FormGroup>
                                    <Label>Deskripsi Produk</Label>
                                    <Input disabled name="inputtedNumber" value={this.state.newProductDesc}
                                        placeholder="-" />
                                </FormGroup>
                            </Form>
                            <br></br>
                            <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                        </ModalBody>
                        <ModalFooter>
                            <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                Simpan
                                        </Button>
                            <Modal
                                onExit={this.clearForm}
                                isOpen={this.state.modal_nested}
                                toggle={this.toggle('nested')}>
                                <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                <ModalFooter>
                                    <Button color="primary" name="Tambah" onClick={this.updatePointTabel({ ...this.state.currentPoint })} disabled={loading}>
                                        {!loading && "Ya"}
                                        {loading && (
                                            <MdAutorenew />
                                        )}
                                        {loading && <span>Sedang diproses</span>}
                                    </Button>{' '}
                                    {!loading && <Button
                                        color="secondary"
                                        onClick={this.toggle('nested')}>
                                        Tidak
                                                </Button>}
                                </ModalFooter>
                            </Modal>
                            <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                Batal
                                        </Button>
                        </ModalFooter>
                    </Modal>

                    {/* Modal Status */}
                    <Modal
                        isOpen={this.state.modal_statusData}
                        toggle={this.toggle('statusData')}>
                        <ModalHeader toggle={this.toggle('statusData')}>
                            {this.state.modal_statusDataTitle}
                        </ModalHeader>
                        <ModalBody>
                            <strong>Procode: {this.state.karakterstatus && this.state.karakterstatus.lpbd_procod}</strong>
                            <br></br>
                            <strong>Deskripsi Produk: {this.state.karakterstatus && this.state.karakterstatus.nama} </strong>
                            <br></br>
                            <br></br>
                            {this.state.modal_statusDataBody}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" name="btnStatus" onClick={this.setKarakterActiveYN(this.state.karakterstatus)} disabled={loading}>
                                {!loading && "Ya"}
                                {loading && (
                                    <MdAutorenew />
                                )}
                                {loading && <span>Sedang diproses</span>}
                            </Button>{' '}
                            {!loading && <Button color="secondary" onClick={this.toggle('statusData')}>
                                Tidak
                                        </Button>}
                        </ModalFooter>
                    </Modal>
                </FormGroup>
                {tabelPoint}
            </Form>

        //MAIN LAYOUT
        return <React.Fragment> <Modal isOpen={this.props.show} backdrop={true} toggle={this.props.toggleParent}>
            <ModalHeader >
                {this.props.judul}
            </ModalHeader>
            <ModalBody>{modalBody}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={this.props.toggleChild} >
                    Simpan
            </Button>
                <Modal
                    onExit={this.props.handleClose}
                    isOpen={this.props.showChild}
                    toggle={this.props.toggleChild}>
                    <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                    <ModalBody>

                        Apakah Anda yakin ingin menyimpan data ini?
                        </ModalBody>
                    <ModalFooter>
                        <Button name="btnEdit" color="primary" onClick={this.props.processInsertPD(this.state.inputtedProcode, this.state.result === null ? null : [...this.state.result])} disabled={this.props.loading}>
                            {!this.props.loading && "Ya"}
                            {this.props.loading && (
                                <MdAutorenew />
                            )}
                            {this.props.loading && <span>Sedang diproses</span>}
                        </Button>
                        {!this.props.loading &&
                            <Button color="secondary" onClick={this.props.toggleChild}>
                                Tidak
                    </Button>}
                    </ModalFooter>
                </Modal>

                <Button color="secondary" onClick={this.props.toggleParent}>
                    Batal
            </Button>
            </ModalFooter>
        </Modal>
        </React.Fragment>
    }
}