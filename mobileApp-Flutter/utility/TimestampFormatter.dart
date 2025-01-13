// date_formatter.dart
import 'package:intl/intl.dart';

class DateFormatter {
  // Metodo per formattare il timestamp
  static String formatTimestamp(int timestamp) {
    // Converti il timestamp in un oggetto DateTime
    DateTime date = DateTime.fromMillisecondsSinceEpoch(timestamp);

    // Formatta il DateTime in una stringa leggibile in italiano
    return DateFormat('dd/MM/yyyy, HH:mm').format(date);
  }
}
