import 'package:flutter/material.dart';

class IconBar extends StatefulWidget {
  double? t;
  double? b;
  double? l;
  double? r;
  IconData icon;
  Color iconColor;
  IconBar({super.key, required this.t, required this.b, required this.l, required this.r, required this.icon,required this.iconColor});

  @override
  State<IconBar> createState() => _IconBarState();
}

class _IconBarState extends State<IconBar> {
  @override
  Widget build(BuildContext context) {
    return Positioned(
        top: widget.t,
        bottom: widget.b,
        left: widget.l,
        right: widget.r,

        child: IconButton(
            onPressed: () => {},
            icon:  Icon(
              widget.icon,
              size: 25,
              color: widget.iconColor,
            )));
  }
}
