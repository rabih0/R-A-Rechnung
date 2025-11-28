import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:table_calendar/table_calendar.dart';

import '../providers/app_provider.dart';
import '../widgets/side_menu.dart';
import '../models/appointment.dart';
import '../models/customer.dart';

class AppointmentScreen extends StatefulWidget {
  const AppointmentScreen({super.key});

  @override
  State<AppointmentScreen> createState() => _AppointmentScreenState();
}

class _AppointmentScreenState extends State<AppointmentScreen> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final appointments = provider.appointments;

    return Scaffold(
      appBar: AppBar(title: const Text('Termine')),
      drawer: const SideMenu(),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 10, 16),
            lastDay: DateTime.utc(2030, 3, 14),
            focusedDay: _focusedDay,
            calendarFormat: _calendarFormat,
            selectedDayPredicate: (day) {
              return isSameDay(_selectedDay, day);
            },
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
            },
            onFormatChanged: (format) {
              setState(() {
                _calendarFormat = format;
              });
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            eventLoader: (day) {
              return appointments
                  .where((appt) => isSameDay(appt.date, day))
                  .toList();
            },
          ),
          const SizedBox(height: 8.0),
          Expanded(
            child: ListView(
              children: _getAppointmentsForDay(appointments, _selectedDay!).map(
                (appt) {
                  final customer = provider.customers.firstWhere(
                    (c) => c.id == appt.customerId,
                    orElse: () => Customer(
                      id: -1,
                      name: 'Unbekannt',
                      email: '',
                      phone: '',
                      address: '',
                    ),
                  );
                  return ListTile(
                    leading: const Icon(Icons.event),
                    title: Text('${appt.time} - ${customer.name}'),
                    subtitle: Text(appt.description),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => provider.deleteAppointment(appt.id!),
                    ),
                  );
                },
              ).toList(),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddAppointmentDialog(context, provider),
        child: const Icon(Icons.add),
      ),
    );
  }

  List<Appointment> _getAppointmentsForDay(
    List<Appointment> appointments,
    DateTime day,
  ) {
    return appointments.where((appt) => isSameDay(appt.date, day)).toList();
  }

  void _showAddAppointmentDialog(BuildContext context, AppProvider provider) {
    Customer? selectedCustomer;
    final descriptionController = TextEditingController();
    TimeOfDay selectedTime = TimeOfDay.now();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Neuer Termin'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                DropdownButtonFormField<Customer>(
                  decoration: const InputDecoration(labelText: 'Kunde'),
                  // ignore: deprecated_member_use
                  value: selectedCustomer,
                  items: provider.customers.map((c) {
                    return DropdownMenuItem(value: c, child: Text(c.name));
                  }).toList(),
                  onChanged: (v) => setState(() => selectedCustomer = v),
                ),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(labelText: 'Beschreibung'),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Text('Zeit: ${selectedTime.format(context)}'),
                    TextButton(
                      onPressed: () async {
                        final time = await showTimePicker(
                          context: context,
                          initialTime: selectedTime,
                        );
                        if (time != null) {
                          setState(() => selectedTime = time);
                        }
                      },
                      child: const Text('Ändern'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Abbrechen'),
            ),
            ElevatedButton(
              onPressed: selectedCustomer == null
                  ? null
                  : () {
                      final appointment = Appointment(
                        customerId: selectedCustomer!.id!,
                        date: _selectedDay ?? DateTime.now(),
                        time: selectedTime.format(context),
                        description: descriptionController.text,
                      );
                      provider.addAppointment(appointment);
                      Navigator.pop(context);
                    },
              child: const Text('Speichern'),
            ),
          ],
        ),
      ),
    );
  }
}
