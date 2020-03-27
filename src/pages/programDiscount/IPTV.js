import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, FormGroup
} from 'reactstrap';
import { MdSearch, MdAutorenew, MdEdit, MdDelete } from 'react-icons/md';
import {
    MdLoyalty,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink'

import * as firebase from 'firebase/app';

const perf = firebase.performance();


const initialCurrentDimen = {
    procod: "",
    nama: "",
    note: "",
    aktifyn: "Y",
    p: -1,
    l: -1,
    t: -1,
    d: -1,
    dmin: -1,
    bentuk: ""
}

class IPTV extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            currentDimen: { ...initialCurrentDimen },
            inputtedName: '',
            currentPage: 1,
            realCurrentPage: 1,
            todosPerPage: 5,
            maxPage: 1,
            flag: 0,
            keyword: '',
            active_user_id: "10",
            loading: false,
            checked: false,
            barcode: "",
            newProductDesc: '',
            newProcode: '',
            enterButton: false
        };
    }
    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value, currentPage: 1, realCurrentPage: 1 }, () => {
            this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
        });
    }

    //set Current Page
    paginationButton(event, flag, maxPage = 0) {
        var currPage = Number(event.target.value);
        if ((currPage + flag) > 0 && (currPage + flag) <= maxPage) {
            this.setState({
                currentPage: (currPage + flag),
                realCurrentPage: (currPage + flag),
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
    }

    pagination = (value, arrow, maxPage = 0) => {
        var currPage = Number(value);
        if ((currPage + arrow) > 0 && (currPage + arrow) <= maxPage) {
            this.setState({
                currentPage: (currPage + arrow),
                realCurrentPage: (currPage + arrow),
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
        console.log("YES BISA");

    }

    enterPressedPage = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.state.currentPage > 0) {
                if (this.state.currentPage > this.state.maxPage) {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.maxPage,
                        currentPage: prevState.maxPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                } else {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.currentPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                }
            }
        }
    }

    enterPressedSearch = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, realCurrentPage: 1 }
                , () => { this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword); });
        }
    }

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

    getListbyPaging(currPage, currLimit, kword) {
        const trace = perf.trace('getDimensiListByPaging');
        trace.start();
        const urlA = myUrl.url_getDimensiListByPaging;
        var payload = {
            offset: (currPage - 1) * currLimit,
            limit: currLimit,
            keyword: kword,
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
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState(
                        {
                            loading: false
                        }
                    );
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }
                    ;
                } else {
                    this.setState({ result: data, maxPage: data.page ? data.page : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
                this.setState(
                    {
                        loading: false
                    }
                );
            }
            );
    }

    componentDidMount() {
        // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }

    searchBarcode = (currentBarcode) => (event) => {
        const trace = perf.trace('Product');
        trace.start();
        const currButton = event.target;

        currButton.disabled = true;

        var url = myUrl.url_searchBarcode + "?findby=barcode";
        var payload = {
            barcode: currentBarcode,
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

        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    currButton.disabled = false;
                    this.setState(
                        {
                            loading: false
                        }
                    );
                }
            }).then(result => {
                console.log(result);
                var data = result.data;
                if (data === null) {
                    this.showNotification("Data tidak ditemukan!", 'error');
                    this.setState({
                        newProductDesc: '',
                        newProcode: ''

                    });
                    currButton.disabled = false;
                }
                else {
                    var data = result.data[0];
                    this.setState({
                        newProductDesc: data.pro_name2,
                        newProcode: data.pro_code

                    })
                    this.setState(prevState => (
                        {
                            currentDimen: { ...prevState.currentDimen, nama: data.pro_name2 ? data.pro_name2 : "", procod: data.pro_code ? data.pro_code : "" }
                        }));
                    currButton.disabled = false;
                }
            }).catch((err) => {
                console.log(err);
                this.showNotification("Koneksi ke server gagal!", 'error');
                this.setState(
                    {
                        loading: false
                    }
                );
                currButton.disabled = false;
            });
    }

    insertMasterDimen = param => () => {
        const trace = perf.trace('newDimensiProd');
        trace.start();
        const currentDimen = param;
        var url = myUrl.url_newDimensiProd;
        this.setState({ enterButton: true })

        //JIKA BARCODE SEARCH BELUM KETEMU NAMA

        this.fetchData();
        var payload = {
            procod: currentDimen.procod,
            nama: currentDimen.nama,
            note: currentDimen.note,
            p: (currentDimen.p === "" || currentDimen.note === null) ? -1 : currentDimen.p,
            l: (currentDimen.l === "" || currentDimen.note === null) ? -1 : currentDimen.l,
            t: (currentDimen.t === "" || currentDimen.note === null) ? -1 : currentDimen.t,
            d: (currentDimen.d === "") || currentDimen.note === null ? -1 : currentDimen.d,
            bentuk: currentDimen.bentuk,
            dmin: (currentDimen.dmin === "" || currentDimen.dmin === null) ? -1 : currentDimen.dmin,
            aktifyn: currentDimen.aktifyn,
            userid: this.state.active_user_id,
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
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false,
                        currentDimen: { ...initialCurrentDimen }
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState({ loading: false, enterButton: false });
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }
                    ;
                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
                this.setState({ loading: false, enterButton: false });
            });
    }

    insertMasterDimenShortcut = param => {
        const trace = perf.trace('newDimensiProd');
        trace.start();
        const currentDimen = param;
        var url = myUrl.url_newDimensiProd;
        this.setState({ enterButton: true })

        //JIKA BARCODE SEARCH BELUM KETEMU NAMA

        console.log("ANJAY")
        this.fetchData();
        var payload = {
            procod: currentDimen.procod,
            nama: currentDimen.nama,
            note: currentDimen.note,
            p: (currentDimen.p === "" || currentDimen.note === null) ? -1 : currentDimen.p,
            l: (currentDimen.l === "" || currentDimen.note === null) ? -1 : currentDimen.l,
            t: (currentDimen.t === "" || currentDimen.note === null) ? -1 : currentDimen.t,
            d: (currentDimen.d === "") || currentDimen.note === null ? -1 : currentDimen.d,
            bentuk: currentDimen.bentuk,
            dmin: (currentDimen.dmin === "" || currentDimen.dmin === null) ? -1 : currentDimen.dmin,
            aktifyn: currentDimen.aktifyn,
            userid: this.state.active_user_id,
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
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false,
                        currentDimen: { ...initialCurrentDimen }
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState({ loading: false, enterButton: false });
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }
                    ;
                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
                this.setState({ loading: false, enterButton: false });
            });
    }

    updateDimen = (first_param) => {

        const trace = perf.trace('updateDataDimensiProd');
        trace.start();
        var url = myUrl.url_updateDataDimensiProd;

        const editDimen = first_param;

        this.fetchData();
        var payload = {
            procod: editDimen.procod,
            nama: editDimen.nama,
            note: editDimen.note,
            p: (editDimen.p === "" || editDimen.p === null) ? -1 : editDimen.p,
            l: (editDimen.l === "" || editDimen.l === null) ? -1 : editDimen.l,
            t: (editDimen.t === "" || editDimen.t === null) ? -1 : editDimen.t,
            d: (editDimen.d === "" || editDimen.d === null) ? -1 : editDimen.d,
            bentuk: editDimen.bentuk,
            dmin: (editDimen.dmin === "" || editDimen.dmin === null) ? -1 : editDimen.dmin,
            aktifyn: editDimen.aktifyn,
            userid: this.state.active_user_id,
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
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested_edit: false,
                        modal_nested_parent_edit: false,
                        checked: false,
                        loading: false,
                        currentDimen: { ...initialCurrentDimen }
                    });

                    return response.json()
                }
                else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState({ loading: false, enterButton: false });
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }
                    ;
                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
                this.setState({ loading: false, enterButton: false });
            });
    }

    setData = (data = null) => {
        if (data === null || data === -1) {
            return "-";
        } else {
            if (typeof (data) === "number" && !Number.isInteger(data)) {
                return data.toFixed(2);
            } else {
                return data;
            }
        }
    }

    //modal Tambah
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal Edit
    state = {
        modal_edit: false,
        modal_backdrop: false,
        modal_nested_parent_edit: false,
        modal_nested_edit: false,
        editDimen: {},
    }

    //modal Edit
    state = {
        modal_hapus: false,
        modal_backdrop: false,
        modal_nested_parent_hapus: false,
        modal_nested_hapus: false,
        editDimen: {},
    }

    //modal update YN
    state = {
        modal_active: false,
        modal_deactive: false,
        active_deptcode_deactive: {},
        active_deptcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_deptcode_deactive: todo,

        });
    }

    toggleActiveData = (todo) => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_deptcode_active: todo,
        });
    }

    toggleEditData = (modalType, todo) => {
        if (!modalType) {
            const modal_edit = Object.assign({}, this.state.modal_edit);
            return this.setState({
                modal_edit: !modal_edit
            });
        }

        if (modalType === "nested_parent_edit") {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editDimen: todo,
                checked: (todo.aktifyn === "Y") ? true : false,
            }, () => {
            });
        } else {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editDimen: todo,
            });
        }

    }

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

        });
    };

    fetchData = () => {
        this.setState({ loading: true });
    };

    handleClose = () => {
        this.setState({
            checked: false,
            newProductDesc: '',
            newProcode: '',
            barcode: '',
            modal_nested: false,
            modal_nested_edit: false,
            modal_nested_parent_hapus: false
        });

    }
    handleCheckboxChange = (event) => {
        let currentDimen = this.state.currentDimen;
        currentDimen["aktifyn"] = (event.target.checked ? "Y" : "N");
        this.setState({ checked: event.target.checked, currentDimen });
    }

    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }


    render() {
        const { loading } = this.state;
        // const currentTodos = this.state.result.result;
        const currentTodos = [ {
            "ip_address": "192.168.1.2",
            "nama_outlet": "Cantury TA",
            "tema": "Natal"
        },
		{
            "ip_address": "192.168.1.3",
            "nama_outlet": "Cantury TA",
            "tema": "Halloween"
        },
		{
            "ip_address": "192.168.1.4",
            "nama_outlet": "Cantury TA",
            "tema": "Tahun Baru"
        },
		{
            "ip_address": "192.168.2.2",
            "nama_outlet": "Cantury CP",
            "tema": "Idul Fitri"
        },
		{
            "ip_address": "192.168.2.3",
            "nama_outlet": "Cantury CP",
            "tema": "Natal"
        }]
        const isEnabled = this.canBeSubmitted();

        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>
                <td scope="row">{todo.ip_address}</td>
                <td>{todo.nama_outlet}</td>
                <td>{todo.tema}</td>
                <td >
                    <Button style={{ margin: "0px" }} color="secondary" size="sm" onClick={() => this.toggleEditData('nested_parent_edit', { ...todo })}><MdEdit /></Button>
                </td>
                <td >
                    <Button style={{ margin: "0px" }} color="danger" size="sm" onClick={() => this.toggleEditData('nested_parent_hapus', { ...todo })}><MdDelete /></Button>
                </td>
            </tr>
        });

        return (
            <Page
                title="Daftar IP TV"
                breadcrumbs={[{ name: 'IPTV', active: true }]}
                className="IPTV"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                                <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                    <MdSearch
                                        size="20"
                                        className="cr-search-form__icon-search text-secondary"
                                    />
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Search..."
                                        id="search"
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={event => this.enterPressedSearch(event, true)}
                                    />
                                </Form>

                                {/* Modal + Button Tambah */}
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>


                                    {/* TAMBAH IP */}
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah IP TV
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>IP Address</Label>
                                        <Input type="namaunit" autoComplete="off" id="unit" onChange={evt => this.inputBarcode(evt)}
                                            value={this.state.barcode}
                                            placeholder="Masukkan IP Address" />
                                        <br></br>

                                        <Label for="exampleSelect">Outlet</Label>
                                        <Input type="select" name="select">
                                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Outlet</option>
                                            <option>Century TA</option>
                                                <option>Century CP</option>
                                                <option>Century CL</option>
                                                <option>Century Senayan City</option>
                                                <option>Century Grand Indonesia</option>
                                        </Input>
                                        <br></br>

                                        <Label for="exampleSelect">Tema</Label>
                                        <Input type="select" name="select">
                                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Tema</option>
                                            <option>Halloween</option>
                                            <option>Natal</option>
                                            <option>Tahun Baru</option>
                                            <option>Imlek</option>
                                            <option>Lebaran</option>
                                        </Input>
                                        <br></br>

                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                {/* <strong>Kode: {this.state.currentDimen && this.state.currentDimen.procod}</strong>
                                                <br />
                                                <strong>Nama: {this.state.currentDimen && this.state.currentDimen.nama}</strong>
                                                <br />
                                                <strong>Note: {this.state.currentDimen && this.state.currentDimen.note}</strong>
                                                <br />
                                                <strong>Panjang: {this.state.currentDimen && this.setData(this.state.currentDimen.p)}</strong>
                                                <br />
                                                <strong>Lebar: {this.state.currentDimen && this.setData(this.state.currentDimen.l)}</strong>
                                                <br />
                                                <strong>Tinggi: {this.state.currentDimen && this.setData(this.state.currentDimen.t)}</strong>
                                                <br />
                                                <br></br> */}
                                                Apakah Anda yakin ingin menyimpan data ini?
                                                </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" /*onClick={this.insertMasterDimen(this.state.currentDimen)}*/ onClick={this.toggle('nested_parent')} disabled={loading}>
                                                    {!loading && "Ya"}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && "Sedang diproses"}
                                                </Button>{' '}
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                {/* Modal Edit */}
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent_edit}
                                    toggle={this.toggle('nested_parent_edit')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit IP TV
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>IP Address</Label>
                                        <Input disabled type="namaunit" autoComplete="off" id="unit" onChange={evt => this.inputBarcode(evt)}
                                            value={this.state.barcode}
                                            placeholder="Masukkan IP Address" />
                                        <br></br>

                                        <Label for="exampleSelect" >Outlet</Label>
                                        <Input disabled type="select" name="select">
                                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Outlet</option>
                                            <option>Century 1</option>
                                            <option>Century 2</option>
                                            <option>Century 3</option>
                                            <option>Century 4</option>
                                            <option>Century 5</option>
                                        </Input>
                                        <br></br>

                                        <Label for="exampleSelect">Tema</Label>
                                        <Input type="select" name="select">
                                            <option value="" name="outlet" id="outlet" selected disabled hidden>Pilih Tema</option>
                                            <option>Halloween</option>
                                            <option>Natal</option>
                                            <option>Tahun Baru</option>
                                            <option>Imlek</option>
                                            <option>Lebaran</option>
                                        </Input>
                                        <br></br>
                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested_edit')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested_edit}
                                            toggle={this.toggle('nested_edit')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                Apakah Anda yakin ingin menyimpan data ini?
                                                <br />
                                                <strong>{this.state.editDimen && this.state.editDimen.nama}</strong>
                                                
                                                <br></br>
                                                </ModalBody>
                                            <ModalFooter>
                                                <Button id="btnEdit" color="primary" /*onClick={() => this.updateDimen(this.state.editDimen)}*/ onClick={this.toggle('nested_parent_edit')} disabled={loading}>
                                                    {!loading && "Ya"}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && "Sedang diproses"}
                                                </Button>
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested_edit')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        <Button color="secondary" onClick={this.toggle('nested_parent_edit')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                                {/* Modal Hapus */}
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent_hapus}
                                    toggle={this.toggle('nested_parent_hapus')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_hapus')}>
                                        Konfirmasi Penghapusan
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Apakah Anda yakin untuk Menghapus Data ini?</Label>
                                        <br></br>
                                        <strong>{this.state.editDimen && this.state.editDimen.nama}</strong>

                                        <br></br>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested_parent_hapus')}>
                                            Simpan
                                        </Button>
                                        <Button color="secondary" onClick={this.toggle('nested_parent_hapus')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>

                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                    striped>
                                    <thead>
                                        <tr>
                                            <td colSpan='11' className="text-right" style={{ border: 'none' }}>
                                                <Label style={{ width: '50%', textAlign: 'left' }}>F1: Tambah, F3: Search</Label>
                                                <Label style={{ width: '50%', textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>IP Address</th>
                                            <th>Nama Outlet</th>
                                            <th>Tema</th>
                                            <th>Edit</th>
                                            <th>Hapus</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                        {!currentTodos && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='11' className="text-center">TIDAK ADA DATA</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardBody>
                                <Row>
                                    <Col md="9" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Tampilkan</InputGroupAddon>
                                            <select
                                                name="todosPerPage"
                                                style={{ height: '38px' }}
                                                value={this.state.value}
                                                onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                            <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col md="3" sm="12" xs="12">
                                        <Card className="mb-3s">
                                            <ButtonGroup >
                                                <Button
                                                    name="FirstButton"
                                                    value={1}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10092;&#10092;
                                       </Button>
                                                <Button
                                                    name="PrevButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, -1, this.state.maxPage)}>
                                                    &#10092;
                                       </Button>
                                                <input
                                                    type="text"
                                                    placeholder="Page"
                                                    outline='none'
                                                    value={this.state.currentPage}
                                                    onChange={(e) => this.setState({ currentPage: e.target.value })}
                                                    onKeyPress={(e) => this.enterPressedPage(e)}
                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                />
                                                <Button
                                                    name="NextButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, 1, this.state.maxPage)}>
                                                    &#10093;
                                       </Button>
                                                <Button
                                                    name="LastButton"
                                                    value={this.state.maxPage}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10093;&#10093;
                                       </Button>
                                            </ButtonGroup>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <script>
                    {document.onkeydown = (e) => {
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                //ctrl + kanan untuk last
                                case "ArrowRight":
                                    this.pagination(this.state.maxPage, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;

                                //ctrl + kiri untuk first
                                case "ArrowLeft":
                                    this.pagination(1, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;
                            }
                        }
                        switch (e.key) {
                            //enter
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.insertMasterDimenShortcut(this.state.currentDimen) }
                                else if (this.state.modal_nested_edit === true && this.state.enterButton === false) {
                                    //function editMaster
                                    this.updateDimen(this.state.editDimen)
                                }
                                break;
                            // f1
                            case "F1":
                                this.testFunc("nested_parent");
                                console.log(this.state.modal_nested_parent);
                                document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3
                            case "F3":
                                // alert("untuk search");
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //kanan untuk next
                            case "ArrowRight":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, 1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                            //kiri untuk prev
                            case "ArrowLeft":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, -1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;


                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>
            </Page>
        );
    }

    canBeSubmitted() {
        const { currentDimen } = this.state;
        const { barcode } = this.state;
        return barcode.length > 0 && barcode.trim() !== "";

    }


    updateInputValue(value, field, Dimen) {
        let currentDimen = this.state[Dimen];
        currentDimen[field] = value;
        this.setState({ currentDimen });
    }

    inputBarcode = event => {
        this.setState(
            {
                barcode: event.target.value
            }
        )
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default IPTV;