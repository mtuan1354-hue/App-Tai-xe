import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
} from 'react-native';

const BANK_ID = 'MB';
const BANK_ACCOUNT = '0988886666';
const BANK_OWNER = 'CONG TY NINJA SHIP VN';

const formatVND = (num) => Number(num || 0).toLocaleString('vi-VN') + 'đ';

export default function App() {
  const [online, setOnline] = useState(true);
  const [balance, setBalance] = useState(200000);
  const [earnings, setEarnings] = useState(0);

  const [walletTab, setWalletTab] = useState('none');
  const [amountInput, setAmountInput] = useState('100000');
  const [bankTarget, setBankTarget] = useState('MB - 0912345678 - NGUYEN VAN A');

  const [orders, setOrders] = useState([
    {
      id: 'NJ90412',
      service: 'Đặt đồ ăn',
      note: '2 tô Bún bò + 1 Trà đá',
      pointA: '45 Hùng Vương',
      pointB: '120 Lê Duẩn',
      km: 2.5,
      price: 15000,
      paidOnline: true,
      status: 'pending',
    },
    {
      id: 'NJ90413',
      service: 'Mua hộ / Nhận hộ',
      note: 'Mua hộp thuốc cảm + nước suối',
      pointA: 'Nhà thuốc Long Châu',
      pointB: '88 Nguyễn Trãi',
      km: 1.8,
      price: 10000,
      paidOnline: false,
      status: 'pending',
    },
  ]);

  const handleAction = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (nextStatus === 'completed' && o.status !== 'completed') {
          setEarnings((e) => e + o.price);
          if (o.paidOnline) {
            setBalance((b) => b + o.price);
          }
        }
        return { ...o, status: nextStatus };
      })
    );
  };

  const handleTopupConfirm = () => {
    const val = Math.max(10000, parseInt(amountInput.replace(/\D/g, ''), 10) || 0);
    setBalance((b) => b + val);
    setWalletTab('none');
    Alert.alert('Nạp ký quỹ thành công', `Đã cộng +${formatVND(val)} vào Ví Tài Xế.`);
  };

  const handleWithdrawConfirm = () => {
    const val = Math.max(10000, parseInt(amountInput.replace(/\D/g, ''), 10) || 0);
    if (val > balance) {
      Alert.alert('Lỗi', 'Số dư ví không đủ để rút.');
      return;
    }
    setBalance((b) => b - val);
    setWalletTab('none');
    Alert.alert('Đã gửi lệnh rút tiền', `Rút ${formatVND(val)} về ${bankTarget}`);
  };

  const qrAmount = Math.max(10000, parseInt(amountInput.replace(/\D/g, ''), 10) || 100000);
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${BANK_ACCOUNT}-compact.png?amount=${qrAmount}&addInfo=${encodeURIComponent(
    'NAP TAIXE NINJA'
  )}`;

  const statusText = {
    pending: '🔔 Đơn mới đang chờ nhận',
    accepted: '🏍️ Đang đi mua / lấy hàng',
    bought: '🛍️ Đã mua xong - Đang giao khách',
    completed: '✅ Đã giao hoàn tất',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>🏍️ NINJA SHIP TÀI XẾ</Text>
          <Text style={styles.brandSub}>Nhận đơn • Cập nhật giao hàng • Ví thu nhập</Text>
        </View>
        <TouchableOpacity
          style={[styles.shiftBtn, { backgroundColor: online ? '#16A34A' : '#DC2626' }]}
          onPress={() => setOnline(!online)}
        >
          <Text style={styles.shiftBtnText}>{online ? '🟢 Trực tuyến' : '🔴 Nghỉ ca'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 36 }}>
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>💳 Ví Tài Xế</Text>
            <Text style={styles.walletAmount}>{formatVND(balance)}</Text>
            <Text style={styles.earnText}>Thu nhập chuyến: {formatVND(earnings)}</Text>
          </View>
          <View style={styles.walletActions}>
            <TouchableOpacity
              style={styles.walletBtn}
              onPress={() => setWalletTab(walletTab === 'topup' ? 'none' : 'topup')}
            >
              <Text style={styles.walletBtnText}>+ Nạp VietQR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.walletBtn, styles.withdrawBtn]}
              onPress={() => setWalletTab(walletTab === 'withdraw' ? 'none' : 'withdraw')}
            >
              <Text style={styles.walletBtnText}>Rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>

        {walletTab === 'topup' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏦 Nạp ký quỹ VietQR</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />
            <Image source={{ uri: qrUrl }} style={styles.qrImage} resizeMode="contain" />
            <Text style={styles.qrNote}>
              {BANK_ID} • {BANK_ACCOUNT} • {BANK_OWNER}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleTopupConfirm}>
              <Text style={styles.primaryBtnText}>✅ Xác nhận đã chuyển khoản</Text>
            </TouchableOpacity>
          </View>
        )}

        {walletTab === 'withdraw' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>⬆️ Rút tiền về Ngân hàng / Ví</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />
            <TextInput
              style={styles.input}
              value={bankTarget}
              onChangeText={setBankTarget}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={handleWithdrawConfirm}>
              <Text style={styles.primaryBtnText}>Gửi lệnh rút tiền</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>📦 Danh sách đơn hàng ({orders.length})</Text>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <Text style={styles.orderId}>
                #{order.id} • {order.service}
              </Text>
              <Text style={styles.orderPrice}>{formatVND(order.price)}</Text>
            </View>
            <Text style={styles.orderNote}>{order.note}</Text>
            <Text style={styles.orderRoute}>📍 Lấy: {order.pointA}</Text>
            <Text style={styles.orderRoute}>🏁 Giao: {order.pointB} ({order.km} km)</Text>
            <Text style={styles.orderMeta}>
              {order.paidOnline ? 'Đã thanh toán online' : 'Thu tiền mặt COD'}
            </Text>
            <Text style={styles.orderStatus}>{statusText[order.status]}</Text>

            {online && order.status !== 'completed' && (
              <View style={styles.actionRow}>
                {order.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleAction(order.id, 'accepted')}
                  >
                    <Text style={styles.actionBtnText}>✅ Nhận đơn này</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'accepted' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                    onPress={() => handleAction(order.id, 'bought')}
                  >
                    <Text style={styles.actionBtnText}>🛍️ Đã mua / lấy xong hàng</Text>
                  </TouchableOpacity>
                )}
                {order.status === 'bought' && (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#16A34A' }]}
                    onPress={() => handleAction(order.id, 'completed')}
                  >
                    <Text style={styles.actionBtnText}>🏁 Hoàn tất giao hàng</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  brandSub: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  shiftBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  shiftBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  container: { flex: 1, padding: 14 },
  walletCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  walletLabel: { color: '#9CA3AF', fontSize: 12 },
  walletAmount: { color: '#FFF', fontSize: 22, fontWeight: '800', marginTop: 2 },
  earnText: { color: '#34D399', fontSize: 12, marginTop: 4 },
  walletActions: { gap: 8 },
  walletBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawBtn: { backgroundColor: '#374151' },
  walletBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#FFF', borderRadius: 14, padding: 15, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  qrImage: { width: '100%', height: 190, marginVertical: 8 },
  qrNote: { textAlign: 'center', fontSize: 12, color: '#4B5563', marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderId: { fontSize: 14, fontWeight: '800', color: '#111827' },
  orderPrice: { fontSize: 15, fontWeight: '800', color: '#DC2626' },
  orderNote: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  orderRoute: { fontSize: 13, color: '#4B5563', marginBottom: 2 },
  orderMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  orderStatus: { fontSize: 13, fontWeight: '700', color: '#2563EB', marginTop: 4 },
  actionRow: { marginTop: 10 },
  actionBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
});
